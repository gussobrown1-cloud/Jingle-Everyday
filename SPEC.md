# 🎵 JingleRank — Especificação Técnica Completa v2.0

> Sistema web para monetizar uma série de jingles em formato de ranking público.
> Documento preparado para equipe de desenvolvimento.

---

## 1. VISÃO GERAL DO PRODUTO

**O que é:** JingleRank é uma plataforma de ranking colaborativo de jingles. O público apoia financeiramente seus jingles favoritos via Pix, fazendo-os subir no ranking. Gamificação + monetização + transparência.

**Proposta de valor:**
- **Público:** Participar ativamente, ver seu jingle subir, competir
- **Criador:** Monetizar conteúdo de forma transparente e engajadora
- **Comunidade:** Experiência divertida, competitiva e participativa

**Tom do produto:** Sério porém acessível. Visual sóbrio e profissional. Linguagem clara. Nada de ambiguidade com votação eleitoral — usamos "apoiar", "impulsionar", "subir no ranking".

---

## 2. FLUXO DO USUÁRIO

### Visitante
```
Home (Ranking) → Clica em Jingle → Detalhe → Apoiar via Pix → QR Code → Confirmação → Ranking atualiza
                                           ↓
Home → Sugerir Jingle → Formulário → Aguardar Aprovação
```

### Admin
```
Login → Dashboard (métricas) → Jingles (CRUD) → Sugestões (aprovar/rejeitar) → Pagamentos (histórico)
```

---

## 3. ARQUITETURA TÉCNICA

### MVP (implementado no frontend)
```
React + Vite + Tailwind CSS + Zustand (state) + Framer Motion (animações)
↓
Pronto para conectar a qualquer backend
```

### Produção recomendada
```
Frontend: React/Next.js → Vercel
Backend:  Supabase (PostgreSQL + Auth + Realtime + Edge Functions)
Pix:      OpenPix ou Mercado Pago (webhook → atualiza ranking)
Cache:    Redis via Upstash (ranking em cache)
CDN:      Cloudflare (assets + proteção)
```

---

## 4. MODELO DE DADOS

### jingles
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID PK | |
| title | VARCHAR(200) | Nome do jingle |
| slug | VARCHAR(200) UNIQUE | URL-friendly |
| description | TEXT | Descrição curta |
| media_url | VARCHAR(500) | URL do áudio/vídeo |
| media_type | ENUM | audio, video, youtube |
| total_raised | DECIMAL(12,2) | Total arrecadado |
| donation_count | INTEGER | Quantidade de apoios |
| rank_position | INTEGER | Posição atual |
| previous_position | INTEGER | Posição anterior |
| status | ENUM | draft, pending, published, featured, archived |
| is_featured | BOOLEAN | Destaque |
| today_raised | DECIMAL(12,2) | Arrecadado hoje |
| week_raised | DECIMAL(12,2) | Arrecadado na semana |
| created_at | TIMESTAMP | |
| published_at | TIMESTAMP | |

### donations
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID PK | |
| jingle_id | UUID FK | Jingle apoiado |
| amount | DECIMAL(10,2) | Valor |
| donor_name | VARCHAR(100) | Nome (ou null se anônimo) |
| donor_message | VARCHAR(500) | Mensagem opcional |
| is_anonymous | BOOLEAN | |
| payment_status | ENUM | pending, processing, confirmed, failed, expired |
| pix_code | TEXT | Código Pix copia-e-cola |
| external_id | VARCHAR(200) UNIQUE | ID do provedor |
| paid_at | TIMESTAMP | |
| created_at | TIMESTAMP | |
| ip_address | INET | Anti-fraude |

### suggestions
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID PK | |
| title | VARCHAR(200) | Nome sugerido |
| description | TEXT | Descrição da ideia |
| author_name | VARCHAR(100) | Autor |
| author_email | VARCHAR(200) | Contato |
| author_phone | VARCHAR(20) | WhatsApp |
| status | ENUM | pending, approved, rejected, converted |
| admin_notes | TEXT | Notas internas |
| reviewed_at | TIMESTAMP | |
| created_at | TIMESTAMP | |

### rank_history
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID PK | |
| jingle_id | UUID FK | |
| old_position | INTEGER | |
| new_position | INTEGER | |
| old_total | DECIMAL | |
| new_total | DECIMAL | |
| triggered_by | UUID FK → donations | |
| created_at | TIMESTAMP | |

### audit_log
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID PK | |
| user_id | UUID FK | Admin que fez a ação |
| action | VARCHAR(50) | approve, reject, edit, feature... |
| entity_type | VARCHAR(50) | jingle, suggestion, donation |
| entity_id | UUID | |
| old_data | JSONB | Estado anterior |
| new_data | JSONB | Novo estado |
| created_at | TIMESTAMP | |

---

## 5. TELAS IMPLEMENTADAS

| Rota | Página | Status |
|------|--------|--------|
| `/` | Home — Hero + Stats + Ranking + Como funciona | ✅ |
| Jingle Detail | Detalhes + métricas + apoios recentes | ✅ |
| Apoiar (Modal) | Formulário → QR Code Pix → Confirmação | ✅ |
| Sugerir | Formulário de sugestão | ✅ |
| Como Funciona | Passos + Regras + FAQ | ✅ |
| Admin Login | Autenticação | ✅ |
| Admin Dashboard | Métricas + Últimos apoios | ✅ |
| Admin Jingles | Lista + Destaque | ✅ |
| Admin Sugestões | Aprovar/Rejeitar | ✅ |
| Admin Pagamentos | Tabela + Exportar | ✅ |

---

## 6. REGRAS DE NEGÓCIO

```
RB01: Ranking ordenado por total_raised DESC
RB02: Empates: donation_count DESC, depois published_at ASC
RB03: Apenas status 'published' ou 'featured' aparecem
RB04: Recalcula após cada doação confirmada
RB05: Valor mínimo: R$ 1,00 | Máximo por transação: R$ 10.000
RB06: Doação só conta após confirmação de pagamento
RB07: Doações podem ser anônimas (valor sempre público)
RB08: Cada transação tem ID único (anti-duplicidade)
RB09: Timeout Pix: 30 minutos
RB10: Sugestões passam por aprovação (máx 48h)
RB11: Limite: 3 sugestões por IP/dia
RB12: Total arrecadado sempre público
RB13: Histórico de posição registrado
RB14: Admin pode destacar (featured) manualmente
```

---

## 7. INTEGRAÇÃO PIX (Produção)

### Provedores recomendados
| Provedor | Taxa | Setup | Ideal para |
|----------|------|-------|------------|
| OpenPix | 0.75% | Rápido | MVP |
| Mercado Pago | 0.99% | Médio | Escala |
| Asaas | 0.49% | Rápido | Custo baixo |

### Fluxo
```
1. Usuário clica "Apoiar" → escolhe valor
2. POST /api/donations → cria cobrança no provedor
3. Retorna pix_code + qr_code_url
4. Usuário paga via app bancário
5. Provedor envia webhook POST /api/webhooks/pix
6. Backend confirma pagamento → atualiza ranking
7. WebSocket emite evento → frontend atualiza em tempo real
```

### Webhook
```typescript
POST /api/webhooks/pix
Header: x-webhook-signature: sha256(payload + secret)
Body: { event: "payment.confirmed", external_id: "...", amount: 10.00, paid_at: "..." }
```

---

## 8. API SPECIFICATION

### Público
```
GET  /api/jingles               → ranking (com paginação)
GET  /api/jingles/:slug         → detalhe + doações recentes
POST /api/donations             → { jingle_id, amount, donor_name?, message?, is_anonymous? }
GET  /api/donations/:id/status  → polling de status
POST /api/suggestions           → { title, description, author_name, email?, phone? }
GET  /api/stats                 → totais globais
```

### Admin (autenticado)
```
POST   /api/admin/login
GET    /api/admin/dashboard
GET    /api/admin/jingles
PUT    /api/admin/jingles/:id
POST   /api/admin/jingles/:id/feature
GET    /api/admin/suggestions
POST   /api/admin/suggestions/:id/approve
POST   /api/admin/suggestions/:id/reject
GET    /api/admin/payments?from=&to=&status=
GET    /api/admin/payments/export
```

### WebSocket
```
ranking:update  → { jingle_id, new_position, old_position, new_total, donor_name, amount }
donation:new    → { jingle_id, amount, donor_name }
```

---

## 9. SEGURANÇA

- Rate limiting: 10 req/min por IP em endpoints de pagamento
- Webhook signature validation
- HTTPS obrigatório
- JWT com expiração 1h + refresh token
- bcrypt para senhas
- Input sanitization
- CORS configurado
- CSP headers
- Anti-spam: honeypot + rate limit em sugestões
- Audit log de todas ações admin
- Backup diário do banco

---

## 10. BACKLOG

### Fase 1: MVP Frontend ✅ CONCLUÍDO
- [x] Ranking com cards interativos
- [x] Detalhe do jingle com métricas
- [x] Modal de doação (form → pix → confirmação)
- [x] Formulário de sugestão
- [x] Página "Como funciona" + FAQ
- [x] Painel admin completo
- [x] Design responsivo mobile-first
- [x] Paleta sóbria (azul escuro + slate)
- [x] Animações com Framer Motion
- [x] State management com Zustand
- [x] Notificações toast

### Fase 2: Backend + Pix real
- [ ] Setup Supabase (tabelas + RLS + auth)
- [ ] API REST com Edge Functions
- [ ] Integração OpenPix/Mercado Pago
- [ ] Webhook de confirmação
- [ ] Realtime com Supabase Realtime
- [ ] Upload de mídia (áudio/vídeo)
- [ ] Player de áudio integrado

### Fase 3: Polish + Escala
- [ ] Cache Redis (ranking)
- [ ] CDN para mídia
- [ ] PWA (offline, push notifications)
- [ ] SEO dinâmico (meta tags por jingle)
- [ ] Analytics (Plausible/Posthog)
- [ ] Monitoramento (Sentry)
- [ ] Exportação CSV/PDF de relatórios

### Fase 4: Crescimento
- [ ] Assinaturas mensais (clube de apoiadores)
- [ ] Destaque pago (posição fixa por 24h)
- [ ] Campanhas especiais (desafios temporários)
- [ ] Badges e achievements
- [ ] API pública para embeds
- [ ] Integração com Twitch/YouTube

---

## 11. DECISÕES DE DESIGN

- **Paleta:** Slate (base escura) + Brand blue (#2563eb) + Emerald (sucesso/valores)
- **Tipografia:** Inter (variable font, pesos 400-900)
- **Componentes:** Cards com bordas sutis, cantos arredondados (xl), sombras mínimas
- **Mobile-first:** Layout de coluna única em mobile, grade em desktop
- **Animações:** Framer Motion para entradas, transições e interações
- **Tom:** Profissional, limpo, sem excessos visuais

---

*Versão 2.0 — Produção-ready frontend*
