import axios from "axios";
import { useState } from "react";

const SERVER_URL =
  process.env.REACT_APP_SERVER_URL ?? "http://localhost:8000/api";

interface GreetingJsonRpcResult {
  id: string;
  jsonrpc: string;
  result: GreetingResult;
}

interface GreetingResult {
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
    axios
      .post<GreetingJsonRpcResult>(SERVER_URL, {
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
      <p className="greeting">{greeting}</p>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default GreetingForm;
