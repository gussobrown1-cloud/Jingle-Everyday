# 🚀 Todo Dia um Jingle — Integração com LivePix

O LivePix é perfeito para o seu caso: **sem taxa**, webhook automático, e já suporta nome + mensagem do apoiador.

---

## COMO FUNCIONA

1. Usuário clica em "Apoiar" no jingle
2. Sistema cria uma "mensagem" na API do LivePix
3. Usuário é redirecionado para a página de pagamento do LivePix
4. Após pagar, LivePix envia webhook para seu servidor
5. Sistema confirma o apoio e atualiza o ranking

---

## PASSO 1: CRIAR CONTA NO LIVEPIX

1. Acesse [livepix.gg](https://livepix.gg)
2. Crie sua conta (pode usar conta Google/Twitch/etc)
3. Configure sua chave Pix nas configurações

---

## PASSO 2: CRIAR APLICAÇÃO NA API

1. Vá em **Configurações > Aplicações**
2. Clique em **Criar Aplicação**
3. Preencha:
   - Nome: `Todo Dia um Jingle`
   - URL de redirecionamento: `https://SEU-SITE.vercel.app/callback`
4. Copie o `client_id` e `client_secret`

---

## PASSO 3: CONFIGURAR WEBHOOK

1. Vá em **Configurações > Webhooks**
2. Adicione a URL: `https://SEU-PROJETO.supabase.co/functions/v1/livepix-webhook`
3. O LivePix vai enviar notificações quando receber pagamentos

---

## PASSO 4: CÓDIGO DE INTEGRAÇÃO

### Variáveis de ambiente (Vercel + Supabase)

```
LIVEPIX_CLIENT_ID=seu_client_id
LIVEPIX_CLIENT_SECRET=seu_client_secret
LIVEPIX_REDIRECT_URL=https://seu-site.vercel.app/callback
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### Edge Function: Criar apoio (Supabase)

```typescript
// supabase/functions/create-support/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const LIVEPIX_CLIENT_ID = Deno.env.get('LIVEPIX_CLIENT_ID')!
const LIVEPIX_CLIENT_SECRET = Deno.env.get('LIVEPIX_CLIENT_SECRET')!
const LIVEPIX_REDIRECT_URL = Deno.env.get('LIVEPIX_REDIRECT_URL')!

// Obter token de acesso
async function getAccessToken() {
  const response = await fetch('https://oauth.livepix.gg/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: LIVEPIX_CLIENT_ID,
      client_secret: LIVEPIX_CLIENT_SECRET,
      scope: 'wallet:read webhooks'
    })
  })
  const data = await response.json()
  return data.access_token
}

serve(async (req) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  }

  const { jingle_id, jingle_title, amount, donor_name, donor_message, is_anonymous } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Salvar doação pendente
  const { data: donation, error } = await supabase
    .from('donations')
    .insert({
      jingle_id,
      amount,
      donor_name: is_anonymous ? null : donor_name,
      donor_message,
      is_anonymous,
      payment_status: 'pending'
    })
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: 'Erro ao criar doação' }), { status: 500 })
  }

  // Criar mensagem no LivePix
  const token = await getAccessToken()
  
  const livepixResponse = await fetch('https://api.livepix.gg/v2/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: is_anonymous ? 'Apoiador anônimo' : (donor_name || 'Apoiador'),
      message: `Apoio para: ${jingle_title}${donor_message ? ' - ' + donor_message : ''}`,
      amount: Math.round(amount * 100), // centavos
      currency: 'BRL',
      redirectUrl: `${LIVEPIX_REDIRECT_URL}?donation_id=${donation.id}`
    })
  })

  const livepixData = await livepixResponse.json()

  // Atualizar doação com referência do LivePix
  await supabase
    .from('donations')
    .update({ external_id: livepixData.data.reference })
    .eq('id', donation.id)

  // Retornar URL de pagamento
  // O usuário será redirecionado para a página do LivePix
  return new Response(JSON.stringify({
    payment_url: `https://livepix.gg/pay/${livepixData.data.reference}`,
    donation_id: donation.id
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
})
```

### Edge Function: Webhook do LivePix

```typescript
// supabase/functions/livepix-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const payload = await req.json()
  
  // Evento de mensagem/pagamento recebido
  if (payload.event === 'new' && payload.resource?.type === 'message') {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const reference = payload.resource.reference

    // Buscar doação pela referência
    const { data: donation } = await supabase
      .from('donations')
      .select('*')
      .eq('external_id', reference)
      .single()

    if (!donation) {
      return new Response('Donation not found', { status: 404 })
    }

    // Confirmar pagamento
    await supabase
      .from('donations')
      .update({ 
        payment_status: 'confirmed', 
        paid_at: new Date().toISOString() 
      })
      .eq('id', donation.id)

    // Incrementar contador do jingle
    await supabase.rpc('increment_donation_count', { 
      jingle_id: donation.jingle_id 
    })

    // Recalcular ranking
    await supabase.rpc('recalculate_ranking')

    console.log(`Pagamento confirmado: ${donation.id}`)
  }

  return new Response('OK', { status: 200 })
})
```

### SQL Functions (Supabase)

```sql
-- Função para incrementar contador
CREATE OR REPLACE FUNCTION increment_donation_count(jingle_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jingles 
  SET donation_count = donation_count + 1
  WHERE id = jingle_id;
END;
$$ LANGUAGE plpgsql;

-- Função para recalcular ranking
CREATE OR REPLACE FUNCTION recalculate_ranking()
RETURNS void AS $$
BEGIN
  WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY donation_count DESC) as new_rank
    FROM jingles
    WHERE status IN ('published', 'featured')
  )
  UPDATE jingles j
  SET rank_position = r.new_rank
  FROM ranked r
  WHERE j.id = r.id;
END;
$$ LANGUAGE plpgsql;
```

---

## PASSO 5: ATUALIZAR O FRONTEND

O frontend precisa chamar a API para criar o apoio e redirecionar para o LivePix:

```typescript
// No componente DonationModal, trocar a função de submit:

const handleSubmit = async () => {
  if (amount < 1) return;
  
  setLoading(true);
  
  const response = await fetch('https://SEU-PROJETO.supabase.co/functions/v1/create-support', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jingle_id: jingle.id,
      jingle_title: jingle.title,
      amount,
      donor_name: name,
      donor_message: msg,
      is_anonymous: anon
    })
  });
  
  const data = await response.json();
  
  // Redirecionar para página de pagamento do LivePix
  window.location.href = data.payment_url;
};
```

---

## PASSO 6: PÁGINA DE CALLBACK

Criar uma página para quando o usuário voltar do LivePix:

```typescript
// src/components/PaymentCallback.tsx
export function PaymentCallback() {
  const params = new URLSearchParams(window.location.search);
  const donationId = params.get('donation_id');
  
  // Verificar status do pagamento
  useEffect(() => {
    // Polling ou real-time para verificar se foi confirmado
  }, []);
  
  return (
    <div className="text-center py-20">
      <h1>Verificando pagamento...</h1>
      <p>Aguarde enquanto confirmamos seu apoio.</p>
    </div>
  );
}
```

---

## FLUXO COMPLETO

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuário   │────▶│  Seu Site   │────▶│   LivePix   │
│ clica apoiar│     │ cria doação │     │  página pix │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼ usuário paga
                                        ┌─────────────┐
                                        │   LivePix   │
                                        │   webhook   │
                                        └──────┬──────┘
                                               │
       ┌─────────────┐     ┌─────────────┐     │
       │  Ranking    │◀────│  Supabase   │◀────┘
       │  atualiza   │     │  confirma   │
       └─────────────┘     └─────────────┘
```

---

## CUSTOS

| Item | Custo |
|------|-------|
| LivePix | **Grátis (0% taxa)** |
| Vercel | Grátis |
| Supabase | Grátis até 500MB |
| Total | **R$ 0** |

---

## CHECKLIST

- [ ] Conta no LivePix criada
- [ ] Chave Pix configurada no LivePix
- [ ] Aplicação criada com client_id e client_secret
- [ ] Webhook configurado
- [ ] Supabase configurado com tabelas
- [ ] Edge Functions criadas
- [ ] Variáveis de ambiente no Vercel
- [ ] Teste de pagamento real (R$ 1,00)

---

## DÚVIDAS FREQUENTES

**O LivePix realmente não cobra taxa?**
Correto. O LivePix monetiza através de features premium para streamers, não cobra taxa de transação.

**Quanto tempo demora pra cair?**
Instantâneo via Pix.

**Precisa de CNPJ?**
Não, funciona com CPF (pessoa física).

**Tem limite de valor?**
Mínimo de R$ 1,00. Máximo depende do limite da sua chave Pix.
