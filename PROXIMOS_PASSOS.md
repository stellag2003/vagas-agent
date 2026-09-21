# Próximos passos

O que existe agora é a fundação: parser de skills + score por sobreposição de palavras-chave.
Isso NÃO é ainda "um agente de IA" — é o esqueleto que prova que a lógica de matching funciona.
Estes são os próximos saltos reais, na ordem que eu sugiro atacar:

1. **Trocar keyword-matching por embeddings/LLM** — hoje "React" e "ReactJS" são tratados como
   termos diferentes se não estiverem ambos no dicionário. Um matching semântico (embeddings de
   currículo x vaga) resolve isso e generaliza para vagas que o dicionário nunca previu.
2. **Puxar vagas de verdade** — hoje o agente lê um `.json` estático. O próximo passo é conectar
   numa fonte real (LinkedIn Jobs API, Gupy, ou scraping respeitando os termos de uso do site).
3. **Ler o currículo real, não só `.txt`** — parser de PDF/DOCX do seu currículo de verdade.
4. **Puxar o perfil do LinkedIn** — via export de dados do LinkedIn ou input manual estruturado.
5. **Explicar o "porquê" em linguagem natural** — hoje o output é uma lista de skills. Um agente
   de verdade explica em uma frase por que aquela vaga faz sentido pra você.

Escolha UM desses pontos e ataque primeiro — não os cinco ao mesmo tempo.
