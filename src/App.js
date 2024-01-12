import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  console.log(process.env.REACT_APP_API_URL);
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function deleteTransaction(transactionId) {
    console.log(transactionId);
    const url = process.env.REACT_APP_API_URL + `/transaction/${transactionId}`;
    const response = await fetch(url, { method: "DELETE" });
    setTransactions(
      transactions.filter((transaction) => transaction._id !== transactionId)
    );
    return await response.json();
  }

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }
  async function addNewTransaction(ev) {
    ev.preventDefault();

    const url = process.env.REACT_APP_API_URL + "/transaction";
    const price = name.split(" ")[0];

    if (!name || !price || !description || !datetime) {
      console.error("Missing fields");
      alert("Please fill in required fields");
      return;
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    }).then((response) => {
      console.log(response);

      response.json().then((json) => {
        setName("");
        setDatetime("");
        setDescription("");
        console.log("result", json);
      });
    });

    const updatedTransactions = await getTransactions();
    setTransactions(updatedTransactions);
  }
  let balance = 0;
  for (const transaction of transactions) {
    if (transaction.price != null) {
      balance = balance + transaction.price;
    }
  }

  balance = balance.toFixed(2);
  const fraction = balance.split(".")[1];
  balance = balance.split(".")[0];

  console.log(balance);

  return (
    <main>
      <h1>
        ${balance}
        <span>{fraction}</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder={"-200 new samsung tv"}
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder={"description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className="right_left">
                  <div
                    className={
                      "price " + (transaction.price < 0 ? "red" : "green")
                    }
                  >
                    {transaction.price}
                  </div>
                  <div className="datetime">2022-12-18</div>
                </div>
                <div className="right_right">
                  <button
                    className="delete"
                    onClick={() => deleteTransaction(transaction._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
