# Content Management API
This module/service contain 2 API:
- API Upload Content (file) with requirements:
  - Only accept file type: jpeg, jpg, png, mp4, pdf
  - Only accept file size: 10MB
  - Response `file_id` when upload successful
- API get content (file) based on inputted `id`
  - Response file with it's metadata

## Technical stack
- Infrastructure: Docker, docker-compose
- Framework: NestJs (Typescript)
- Database: Postgres
- File management: Local storage
- Testing tool: Jest

## API specs
- Prefer to Swagger (http://localhost:3000/documentation#/) after start source code

## Source code structure
```
.
├── src
│   ├── constants // placed the common constants of the source code
│   ├── content // the content module, implement 2 API
│   ├── domains // hold the domain object class
│   └── utils // utils function
├── tests
│   └── test-files // placed the asset support testing
└── uploads // Folder to store the uploaded file
```

## Setup
1. Init database
    ```
    docker-compose up -d
    ```
2. Install package
    ```
    npm i
    ```

## Test
### Check code coverage
```
npm run test:cov
```
### Run test

This test include
- Controller test (integration test): full flow tested
- Service test (unit test): mock database to test functionality
```
npm run test
```

## Run
    ```
    npm run start:dev
    ```
API will be hosted at http://localhost:3000
- API upload content: POST http://localhost:3000/contents
- API get content: GET http://localhost:3000/contents/:id

