# Light Mock

This is a lightweight mocking framework for mocking HTTP requests without intercepting XMLHttpRequests or Fetch API as most mocking frameworks do nowadays. 

It mocks HTTP requsts defined within routes().
It maintains an in memory schema to manage state of data records for your mocks.

## Usage

Replace your HTTP client with MockHttpClient. It assumes your HTTP client exposes the same methods as MockHttpClient.

## TODO:
Throw error responses.
Factory to generate records for schema
Optionally intercept XMLHttpRequests.