# Site institucional Antere

Conteúdo estático publicado em https://www.antere.com.br.

- Páginas: `index.html`, `como-funciona.html`, `solucoes.html`, `sobre.html`, `contato.html`, `404.html`
- `assets/`: logos, favicons e imagem Open Graph
- `CNAME`: domínio para GitHub Pages; `_headers`: cabeçalhos para Netlify
- `_src/build_site.py`: gerador das páginas (rode `python3 build_site.py` dentro de `_src` após ajustar, depois copie os HTML gerados para cá)

Formulário de contato envia POST para `https://raregoat-n8n.cloudfy.live/webhook/site-contato`.
CTA de proposta aponta para `https://raregoat-n8n.cloudfy.live/form/proposta?ref=site_institucional`.
