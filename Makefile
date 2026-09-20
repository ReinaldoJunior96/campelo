.DEFAULT_GOAL := ajuda
.PHONY: ajuda dev prod deploy parar logs verificar senha backup restaurar historico limpar

PROD := docker compose -f docker-compose.prod.yml

ajuda: ## Mostra esta lista
	@grep -hE '^[a-z-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[1m%-14s\033[0m %s\n", $$1, $$2}'

# ---------- desenvolvimento ----------

dev: ## Sobe o ambiente de desenvolvimento (site :5173)
	docker compose --profile dev up --build

prod: ## Testa o build de produção localmente, sem TLS (site :8080)
	docker compose --profile prod up --build

parar: ## Derruba tudo que estiver rodando
	docker compose --profile dev --profile prod down
	$(PROD) down

verificar: ## Roda typecheck, build do site e testes da API dentro do Docker
	@echo "== typecheck e build do site =="
	docker run --rm -v "$(PWD)":/app -w /app node:20-bookworm-slim \
		sh -lc 'npm install --no-audit --no-fund >/dev/null && npx tsc --noEmit && npm run build'
	@echo "== build da imagem da API =="
	docker build -q -t campelo-api-verificacao ./server
	@docker rmi -f campelo-api-verificacao >/dev/null
	@echo "\nTudo certo."

# ---------- VPS ----------

deploy: ## Sobe ou atualiza a produção na VPS (com HTTPS)
	@test -f .env || { echo "Falta o .env. Rode: cp .env.example .env"; exit 1; }
	$(PROD) up -d --build
	@echo "\nNo ar. Acompanhe com: make logs"

logs: ## Acompanha os logs da produção
	$(PROD) logs -f --tail=100

historico: ## Lista as últimas versões salvas do conteúdo
	$(PROD) exec api node -e "\
		const {db} = await import('./src/db.js'); \
		console.table(db.prepare('SELECT id, salvo_em, salvo_por FROM conteudo ORDER BY id DESC LIMIT 20').all());"

senha: ## Define a senha do painel. Uso: make senha EMAIL=x@y.com SENHA='...'
	@test -n "$(EMAIL)" -a -n "$(SENHA)" || { echo "Uso: make senha EMAIL=x@y.com SENHA='uma senha longa'"; exit 1; }
	$(PROD) exec api npm run senha -- "$(EMAIL)" "$(SENHA)"

# ---------- backup ----------

backup: ## Gera backup do banco e dos uploads em ./backups
	@mkdir -p backups
	docker run --rm -v campelo-dados:/dados -v "$(PWD)/backups":/saida alpine \
		tar czf /saida/campelo-$$(date +%F-%H%M).tar.gz -C /dados .
	@ls -lh backups | tail -3

restaurar: ## Restaura um backup. Uso: make restaurar ARQUIVO=backups/campelo-....tar.gz
	@test -n "$(ARQUIVO)" || { echo "Uso: make restaurar ARQUIVO=backups/campelo-....tar.gz"; exit 1; }
	@echo "Isto substitui o banco e os uploads atuais. Ctrl+C em 5s para cancelar."
	@sleep 5
	$(PROD) stop api
	docker run --rm -v campelo-dados:/dados -v "$(PWD)":/entrada alpine \
		sh -c 'rm -rf /dados/* && tar xzf /entrada/$(ARQUIVO) -C /dados'
	$(PROD) start api

limpar: ## Remove imagens e containers parados que sobraram
	docker system prune -f
