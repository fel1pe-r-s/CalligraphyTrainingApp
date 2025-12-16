# Mestre Calígrafo - Treino Digital e Impresso

Este é um aplicativo web simples para treino de caligrafia, permitindo tanto a prática digital (em tablets ou com mouse) quanto a impressão de folhas de exercícios.

## Estrutura do Projeto

O projeto foi refatorado para uma estrutura mais organizada:

*   **`caligrafia.html`**: O arquivo principal da aplicação. Abre este arquivo no navegador para usar o app.
*   **`css/styles.css`**: Contém os estilos personalizados, incluindo ajustes para impressão e fontes específicas.
*   **`js/app.js`**: Contém a lógica da aplicação desenvolvida em React.

## Como Usar

### Executando Localmente

Devido às restrições de segurança dos navegadores (CORS), carregar scripts externos via `file://` pode não funcionar corretamente em alguns navegadores (como o Chrome). Para garantir que tudo funcione como esperado, recomenda-se servir os arquivos através de um servidor local simples.

Se você tiver o Python instalado, pode fazer isso facilmente:

1.  Abra o terminal na pasta do projeto:
    ```bash
    cd /caminho/para/appTreinoCaligrafia
    ```
2.  Inicie um servidor HTTP simples:
    ```bash
    # Para Python 3
    python3 -m http.server
    ```
3.  Acesse `http://localhost:8000/caligrafia.html` no seu navegador.

### Funcionalidades

1.  **Estilos de Escrita**: Escolha entre Letra de Forma, Itálico, Medieval ou Jutai Côrte.
2.  **Conteúdo**: Selecione entre Maiúsculas, Minúsculas, Números, Palavras ou Frases.
3.  **Personalizar**: Digite seu próprio texto para treinar.
4.  **Imprimir**: Gere uma folha de treino pronta para impressão (sem os elementos da interface).
5.  **Modo Digital**: Ative para desenhar diretamente na tela sobre as linhas guia.

## Tecnologias

*   **HTML5 & CSS3**
*   **React 18** (sem build step complexo, usando Babel standalone)
*   **Tailwind CSS** (via CDN para estilização rápida)
