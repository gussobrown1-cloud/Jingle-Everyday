# 🚀 Como Colocar o "Todo Dia um Jingle" no Ar

Guia prático para deploy em produção com pagamentos Pix reais.

---

## RESUMO RÁPIDO

| Etapa | Serviço | Custo | Tempo |
|-------|---------|-------|-------|
| 1. Hospedagem | Vercel | Grátis | 5 min |
| 2. Banco de dados | Supabase | Grátis até 500MB | 15 min |
| 3. Pagamento Pix | OpenPix ou Mercado Pago | Taxa por transação | 30 min |
| 4. Domínio (opcional) | Registro.br | ~R$ 40/ano | 10 min |

**Custo total para começar: R$ 0** (só paga taxa quando receber Pix)

---

## ETAPA 1: HOSPEDAGEM (Vercel)

A Vercel hospeda o site gratuitamente.

### Passo a passo:

1. **Suba o código no GitHub**
   ```bash
   # Se ainda não tem repositório:
   git init
   git add .
   git commit -m "Todo Dia um Jingle"
   git remote add origin https://github.com/SEU_USUARIO/todo-dia-um-jingle.git
   git push -u origin main
   ```

2. **Acesse [vercel.com](https://vercel.com)** e faça login com GitHub

3. **Clique em "Add New Project"**

4. **Selecione o repositório** `todo-dia-um-jingle`

5. **Clique em "Deploy"** — pronto, em 1 minuto está no ar!

Você receberá uma URL tipo: `https://todo-dia-um-jingle.vercel.app`

---

## ETAPA 2: BANCO DE DADOS (Supabase)

O Supabase é um banco PostgreSQL gratuito com painel visual.

### Passo a passo:

1. **Acesse [supabase.com](https://supabase.com)** e crie uma conta

2. **Crie um novo projeto** com nome "todo-dia-um-jingle"

3. **Vá em SQL Editor** e rode este script para criar as tabelas:

```sql
-- Jingles
CREATE TABLE jingles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  politician VARCHAR(200) NOT NULL,
  year VARCHAR(10) NOT NULL,
  media_url VARCHAR(500),
  donation_count INTEGER DEFAULT 0,
  rank_position INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Doações
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jingle_id UUID REFERENCES jingles(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  donor_name VARCHAR(100),
  donor_message VARCHAR(500),
  is_anonymous BOOLEAN DEFAULT FALSE,
  payment_status VARCHAR(20) DEFAULT 'pending',
  external_id VARCHAR(200) UNIQUE,
  pix_code TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sugestões
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(200),
  author_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir os 20 jingles iniciais
INSERT INTO jingles (title, slug, politician, year, donation_count, rank_position, status, is_featured) VALUES
('Lula lá', 'lula-la', 'Lula (PT)', '1989', 312, 1, 'featured', true),
('Brilha uma estrela', 'brilha-uma-estrela', 'Collor (PRN)', '1989', 245, 2, 'published', false),
('Muda Brasil', 'muda-brasil', 'Tancredo Neves (PMDB)', '1985', 198, 3, 'published', false),
('Levanta a mão', 'levanta-a-mao', 'Lula (PT)', '2002', 167, 4, 'published', false),
('Eu sou você amanhã', 'eu-sou-voce-amanha', 'Maluf (PDS)', '1984', 156, 5, 'published', false),
('Varre varre vassourinha', 'varre-varre-vassourinha', 'Jânio Quadros (PTN)', '1960', 134, 6, 'published', false),
('Rouba mas faz', 'rouba-mas-faz', 'Ademar de Barros (PSP)', '1962', 118, 7, 'published', false),
('É o Aécio', 'e-o-aecio', 'Aécio Neves (PSDB)', '2014', 102, 8, 'published', false),
('Dilma coração valente', 'dilma-coracao-valente', 'Dilma (PT)', '2010', 95, 9, 'published', false),
('Olê olê olê olá Lula', 'ole-ole-lula', 'Lula (PT)', '2006', 89, 10, 'published', false),
('Serra é o Brasil', 'serra-e-o-brasil', 'José Serra (PSDB)', '2010', 78, 11, 'published', false),
('FHC isso aqui vai virar', 'fhc-isso-vai-virar', 'FHC (PSDB)', '1994', 72, 12, 'published', false),
('Meu Brasil brasileiro', 'meu-brasil-brasileiro', 'Getúlio Vargas', '1950', 65, 13, 'published', false),
('Jingle do JK', 'jingle-jk', 'Juscelino Kubitschek (PSD)', '1955', 58, 14, 'published', false),
('Marina Silva', 'marina-silva', 'Marina Silva (PV)', '2010', 52, 15, 'published', false),
('Bolsonaro Mito', 'bolsonaro-mito', 'Bolsonaro (PSL)', '2018', 48, 16, 'published', false),
('Ciro Gomes 12', 'ciro-gomes-12', 'Ciro Gomes (PDT)', '2018', 42, 17, 'published', false),
('Brizola coração', 'brizola-coracao', 'Leonel Brizola (PDT)', '1989', 38, 18, 'published', false),
('Enéas 56', 'eneas-56', 'Enéas Carneiro (PRONA)', '1994', 35, 19, 'published', false),
('Haddad é Lula', 'haddad-e-lula', 'Haddad (PT)', '2018', 31, 20, 'published', false);
```

4. **Pegue as credenciais** em Project Settings > API:
   - `Project URL` (ex: https://xxxxx.supabase.co)
   - `anon public key`

5. **Adicione no Vercel** como variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## ETAPA 3: PAGAMENTO PIX

### Opção A: OpenPix (Recomendado para começar)

**Por que OpenPix:**
- Taxa: 0,75% por transação (uma das menores)
- Aprovação rápida (1-2 dias)
- Suporta CPF ou CNPJ
- Webhook fácil de configurar

**Passo a passo:**

1. **Acesse [openpix.com.br](https://openpix.com.br)** e crie uma conta

2. **Complete o cadastro** com seus dados (CPF ou CNPJ)

3. **Aguarde aprovação** (geralmente 1-2 dias úteis)

4. **No painel, vá em API > Credenciais** e copie sua `API Key`

5. **Configure o Webhook:**
   - URL: `https://SEU-PROJETO.supabase.co/functions/v1/pix-webhook`
   - Eventos: `OPENPIX:CHARGE_COMPLETED`

### Opção B: Mercado Pago

**Por que Mercado Pago:**
- Marca conhecida
- Aprovação mais rápida
- Taxa: 0,99% por transação

**Passo a passo:**

1. **Acesse [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)**

2. **Crie uma aplicação** no painel de desenvolvedor

3. **Pegue as credenciais** (Access Token)

4. **Configure o Webhook** para receber notificações de pagamento

---

## ETAPA 4: CONECTAR TUDO (Código)

Você precisa criar uma Edge Function no Supabase para:
1. Gerar cobrança Pix
2. Receber webhook de confirmação
3. Atualizar o ranking

### Criar a função de pagamento:

No Supabase, vá em **Edge Functions** e crie `create-pix`:

```typescript
// supabase/functions/create-pix/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const OPENPIX_API_KEY = Deno.env.get('OPENPIX_API_KEY')

serve(async (req) => {
  const { jingle_id, amount, donor_name, donor_message, is_anonymous } = await req.json()
  
  // Criar cobrança na OpenPix
  const response = await fetch('https://api.openpix.com.br/api/v1/charge', {
    method: 'POST',
    headers: {
      'Authorization': OPENPIX_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      correlationID: crypto.randomUUID(),
      value: Math.round(amount * 100), // centavos
      comment: `Apoio: ${donor_name || 'Anônimo'}`
    })
  })
  
  const data = await response.json()
  
  // Salvar no banco
  // ... (inserir na tabela donations)
  
  return new Response(JSON.stringify({
    pix_code: data.charge.brCode,
    qr_code_url: data.charge.qrCodeImage,
    external_id: data.charge.correlationID
  }))
})
```

### Criar o webhook de confirmação:

```typescript
// supabase/functions/pix-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const payload = await req.json()
  
  if (payload.event === 'OPENPIX:CHARGE_COMPLETED') {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    
    // Confirmar pagamento
    const { data: donation } = await supabase
      .from('donations')
      .update({ payment_status: 'confirmed', paid_at: new Date().toISOString() })
      .eq('external_id', payload.charge.correlationID)
      .select()
      .single()
    
    // Incrementar contador do jingle
    await supabase.rpc('increment_donation_count', { jingle_id: donation.jingle_id })
    
    // Recalcular ranking
    await supabase.rpc('recalculate_ranking')
  }
  
  return new Response('OK')
})
```

---

## ETAPA 5: DOMÍNIO PERSONALIZADO (Opcional)

Para ter `www.tododiaujingle.com.br`:

1. **Registre o domínio** em [registro.br](https://registro.br) (~R$ 40/ano)

2. **No Vercel**, vá em Settings > Domains

3. **Adicione o domínio** e siga as instruções de DNS

4. **No Registro.br**, configure os DNS da Vercel

---

## CHECKLIST FINAL

- [ ] Código no GitHub
- [ ] Deploy na Vercel funcionando
- [ ] Banco de dados no Supabase criado
- [ ] Tabelas e dados iniciais inseridos
- [ ] Conta no OpenPix ou Mercado Pago aprovada
- [ ] Edge Functions configuradas
- [ ] Webhook configurado e testado
- [ ] Teste de pagamento real (R$ 1,00)
- [ ] Domínio configurado (opcional)

---

## CUSTOS MENSAIS ESTIMADOS

| Item | Custo |
|------|-------|
| Vercel | Grátis |
| Supabase | Grátis (até 500MB) |
| Domínio | ~R$ 3,50/mês |
| Taxa Pix | 0,75% por transação |

**Exemplo:** Se receber R$ 1.000/mês em apoios, pagará ~R$ 7,50 de taxa.

---

## PRECISA DE AJUDA?

Se quiser, posso:
1. Criar o código completo de integração com Supabase
2. Criar as Edge Functions prontas para usar
3. Configurar o sistema de real-time para atualizar o ranking ao vivo

É só pedir!
