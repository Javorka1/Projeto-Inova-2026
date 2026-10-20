# 🌾 COA CTT — Gestão e Otimização da Logística Agrícola
> **Projeto Inova** | Projeto Acadêmico de Inovação Universitária  
> **Tema:** Logística Agrícola Inteligente na Cadeia de Corte, Transbordo e Transporte (CTT)

---

## 📌 Sobre o Projeto

Este projeto foi desenvolvido no âmbito do **Inova** (iniciativa acadêmica de inovação e tecnologia da faculdade) com o propósito de enfrentar um dos maiores gargalos operacionais e econômicos do agronegócio brasileiro: a **logística agrícola no campo**.

Focado na operação de usinas sucroenergéticas e grandes propriedades agrícolas (inspirado na malha de cana-de-açúcar e grãos do Triângulo Mineiro), o sistema atua como um **Centro de Operações Agrícolas (COA)** digital e inteligente, conectando frentes de colheita, tratores de transbordo, rodotrens em estradas vicinais e as moegas/tombadores da usina de processamento.

---

## 🎯 O Problema Abordado

Nas safras agrícolas, a integração entre o corte e a moagem enfrenta desafios críticos:
1. **Filas Físicas nas Moegas:** Caminhões pesados (rodotrens e treminhões de 74t) chegam em comboio e passam horas no pátio com motor ligado esperando descarga, gerando desperdício massivo de óleo diesel e emissão de carbono.
2. **Desafios das Estradas Vicinais de Terra:** Trechos rurais sofrem com atoleiros causados por chuvas súbitas, pontes de madeira avariadas e poeira densa, travando o escoamento.
3. **Ausência de Conectividade Rural:** O sinal 4G/telefonia no interior dos talhões é frequentemente instável ou inexistente, inviabilizando sistemas web tradicionais que dependem de conexão contínua.
4. **Segurança e Jornada dos Motoristas:** Necessidade de cumprir rigorosamente as normas de descanso e direção contínua da Lei do Motorista (Lei nº 13.103/15).

---

## 🚀 Soluções e Funcionalidades

O sistema foi estruturado em módulos operacionais de alto impacto:

### 1. 🗺️ Despacho Dinâmico & Mapa Vicinal Interativo
- Mapeamento georreferenciado em tempo real com **Leaflet**.
- Visualização de polígonos de talhões agrícolas, frentes de corte ativas, frotas em trânsito e localização da usina central.
- Cálculo de distâncias e rotas de escoamento por estradas vicinais.

### 2. ⏱️ Fila Virtual JIT (*Just-in-Time*) & Modulação de Velocidade
- Eliminação das filas físicas no pátio através de slots agendados nas moegas.
- O sistema calcula e recomenda a **velocidade ótima** para cada caminhão na estrada vicinal. Se uma moega atrasar, o caminhão reduz a velocidade em trânsito com segurança, poupando combustível e chegando no momento exato do tombador.

### 3. ⚠️ Alerta de Tráfego e Incidentes em Estradas Vicinais
- Feed de ocorrências colaborativas no campo: atoleiros, pontes interditadas, porteiras fechadas e veículos em pane.
- Ativação imediata de rotas alternativas e desvios para evitar paralisação da cadeia.

### 4. 🚛 Gestão de Frotas e Jornada de Trabalho
- Acompanhamento de rodotrens de 9 eixos, treminhões, bitrens e colhedoras.
- Monitoramento de telemetria: consumo instantâneo (L/h), velocidade real vs. recomendada e nível de tanque.
- Controle de jornada com alertas de direção contínua (> 4 horas) conforme a legislação trabalhista.

### 5. 🧭 Zoneamento de Área de Abastecimento & Isócronas
- Análise de raios econômicos e tempo de ciclo de transporte em relação à localização da usina.
- Estimativas de produtividade esperada (t/ha) e percentual colhido de cada talhão.

### 6. 📶 Arquitetura *Offline-First* com Simulação Rural
- Aplicação resiliente a quedas de sinal: armazena dados operacionais no cliente (cache local) permitindo o trabalho sem interrupções nos talhões.
- Fila de sincronização automática com o servidor central assim que a conexão é restabelecida.
- Botão interativo para simular perda e reconexão de sinal rural na interface.

### 7. 📊 Indicadores Chave de Desempenho (KPIs do COA)
- Eficiência energética: litros de diesel consumidos por tonelada transportada (L/t).
- Lead time do ciclo completo de CTT (Corte, Transbordo e Transporte).
- Redução percentual do índice de motores ociosos e total de combustível poupado com o algoritmo JIT.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** [React 19](https://react.dev/) com [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/) (alta velocidade de compilação e HMR)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) com design system responsivo em modo escuro industrial
- **Mapas:** [Leaflet](https://leafletjs.com/) para renderização geoespacial
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Linter & Performance:** [Oxlint](https://oxc.rs/)

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Gerenciador de pacotes `npm`

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
   cd NOME_DO_REPOSITORIO
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra a URL indicada no terminal (geralmente `http://localhost:5173`).

5. **Para gerar a build de produção:**
   ```bash
   npm run build
   ```

---

## ☁️ Como Fazer o Deploy no Vercel

O projeto está 100% configurado e pronto para hospedagem na **[Vercel](https://vercel.com/)**:

1. Suba este projeto para a sua conta no **GitHub** (veja as instruções abaixo).
2. Acesse o dashboard da [Vercel](https://vercel.com/) e clique em **"Add New..." ➔ "Project"**.
3. Conecte sua conta do GitHub e selecione o repositório deste projeto.
4. O Vercel detectará automaticamente as configurações de **Vite**:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Clique em **"Deploy"**. Em menos de 1 minuto seu sistema estará no ar com link público!

---

## 👥 Equipe do Projeto (Inova)

Projeto acadêmico desenvolvido para a feira/disciplina de inovação universitária (**Inova**).

* **Curso:** Engenharia / Ciência da Computação / Tecnologia
* **Disciplina / Evento:** Projeto Integrador / Feira Inova
* **Ano:** 2026
