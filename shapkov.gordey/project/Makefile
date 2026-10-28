.PHONY: backend frontend
install:
	cd backend && go mod tidy
	cd frontend && npm install

backend:
	cd backend && go run ./cmd

frontend:
	cd frontend && npm run dev