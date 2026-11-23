# SIGEH — Sistema Integrado de Gestão Hospitalar

MVP acadêmico desenvolvido com HTML, CSS e JavaScript, utilizando `localStorage` do navegador como armazenamento local.

## Como executar
1. Extraia o arquivo ZIP.
2. Abra a pasta `SIGEH`.
3. Dê dois cliques em `index.html` ou abra-o em um navegador atualizado (Chrome, Edge ou Firefox).
4. Não é necessário instalar servidor, banco de dados ou dependências.

## Acesso demonstrativo
- E-mail: `admin@sigeh.com`
- Senha: `123456`
- Use o botão **Sair** no cabeçalho para encerrar a sessão.

A tela de login é apenas uma simulação de acesso para apresentação acadêmica. Como o projeto é 100% local e não possui backend, não oferece autenticação ou segurança real.

## Identidade visual
- Conceito: confiança, acolhimento e tecnologia a serviço do cuidado.
- Cores: azul-petróleo (`#123b4a`), teal (`#087f8c`), menta (`#39b7a5`) e fundo claro (`#f3f8f8`).
- Assinatura: “Cuidar começa com organização.”

## Funcionalidades
- Dashboard com indicadores de pacientes, médicos e consultas.
- Cadastro, edição, pesquisa e exclusão de pacientes.
- Cadastro, edição, pesquisa e exclusão de médicos.
- Cadastro, edição, pesquisa, filtro e exclusão de agendamentos.
- Validação para impedir CPF e CRM duplicados.
- Validação de conflito de horário para médico ou paciente.
- Dados persistidos no navegador por meio de localStorage.

## Dados demonstrativos
Na primeira abertura, o sistema cria dois pacientes, dois médicos e dois agendamentos fictícios para facilitar a apresentação. Esses registros podem ser editados ou excluídos.

## Como limpar os dados
No navegador, abra as ferramentas de desenvolvedor (F12), acesse Console e execute:
`localStorage.removeItem('sigeh_data_v1')`
Depois atualize a página. O sistema voltará a carregar os dados demonstrativos.

## Limitações importantes
- Este é um protótipo local para fins acadêmicos, não um sistema hospitalar pronto para produção.
- Os dados ficam somente no navegador e no dispositivo em que foram cadastrados.
- Não há autenticação real, servidor, sincronização entre usuários, criptografia de dados nem integração com IA.
- Não utilize dados reais de pacientes. Use somente dados fictícios em demonstrações.
- Uma implantação real exigiria backend, banco de dados seguro, controle de acesso, trilhas de auditoria, backups, testes e adequação à LGPD.

## Estrutura
- `index.html`: aplicação completa (estrutura, estilos e lógica JavaScript).
- `README.md`: instruções e documentação.

## Organização dos arquivos
- `index.html`: estrutura das telas e dos formulários.
- `style.css`: identidade visual, cores, espaçamentos e responsividade.
- `script.js`: funcionalidades, validações, login demonstrativo e armazenamento local (`localStorage`).

Mantenha os três arquivos na mesma pasta. Para executar, abra `index.html` no navegador.
