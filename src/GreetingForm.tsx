import axios from "axios";
import { useState } from "react";
import Greeting from "./Greeting";

const SERVER_URL = process.env.REACT_APP_SERVER_URL ?? "http://localhost:3000";

interface GreetingJsonRpcParams {
  name: string;
}

interface GreetingJsonRpcResponse {
  id: string;
  jsonrpc: string;
  result: GreetingJsonRpcResult;
}

interface GreetingJsonRpcRequest {
  id: string;
  jsonrpc: string;
  method: string;
  params: GreetingJsonRpcParams;
}

interface GreetingJsonRpcResult {
  greeting: string;
}

const GreetingForm = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [greeting, setGreeting] = useState("Hello, World!");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const cancelToken = axios.CancelToken;
  const [cancelTokenSource] = useState(cancelToken.source());

  const handleCancelClick = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("User cancelled operation");
    }
  };

  const fetchGreeting = () => {
    const request: GreetingJsonRpcRequest = {
      id: "00000000-0000-0000-0000-000000000000",
      jsonrpc: "2.0",
      method: "greeting",
      params: { name },
    };
    axios
      .post<GreetingJsonRpcResponse>(SERVER_URL, request, {
        cancelToken: cancelTokenSource.token,
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      })
      .then((response) => {
        setGreeting(response.data.result.greeting);
        setIsFetching(false);
      })
      .catch((ex) => {
        let error = axios.isCancel(ex)
          ? "Request Cancelled"
          : ex.code === "ECONNABORTED"
          ? "A timeout has occurred"
          : ex.response.status === 404
          ? "Resource Not Found"
          : "An unexpected error has occurred";

        setError(error);
        setIsFetching(false);
      });
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <div>
      <p>
        Server URL: <a href={SERVER_URL}>{SERVER_URL}</a>
      </p>
      <label htmlFor="inputName">
        Enter name:
        <input
          id="inputName"
          name="inputName"
          onChange={handleChangeName}
          type="text"
          value={name}
        />
      </label>
      <button
        disabled={isFetching}
        id="submitName"
        name="submitName"
        onClick={fetchGreeting}
        type="submit"
      >
        Submit
      </button>
      {isFetching && <button onClick={handleCancelClick}>Cancel</button>}
      <Greeting greeting={greeting} />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default GreetingForm;
