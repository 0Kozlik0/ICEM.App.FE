# ICEM Application (Frontend)

`InfoTODO`

# Basic commands

***!Important!*** - rename .env.example to .env and set variables for your local environment

1. Execute application locally 

    `npm start`

2. Local Docker execution (Development Docker)

    `docker-compose -f docker/docker-compose.dev.yml up`

    for rebuild

    `docker-compose -f docker/docker-compose.dev.yml up --build`

3. Execute tests 

    `npm test`

# Deployment

### Local (no docker)

`npm run build`

`npm install -g serve` 

`serve -s build`

### Docker

#### Production
`TODO`