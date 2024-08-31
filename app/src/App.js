import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    try {
      if (!signer) {
        throw new Error(
          "Signer is not available. Please ensure the local network is running."
        );
      }

      const beneficiary = document.getElementById("beneficiary").value;
      const arbiter = document.getElementById("arbiter").value;
      const value = ethers.BigNumber.from(document.getElementById("wei").value);

      const escrowContract = await deploy(signer, arbiter, beneficiary, value);

      const escrow = {
        address: escrowContract.address,
        arbiter,
        beneficiary,
        value: value.toString(),
        approved: false,
        handleApprove: async () => {
          await approve(escrowContract, signer);
          setEscrows((prevEscrows) =>
            prevEscrows.map((e) =>
              e.address === escrowContract.address
                ? { ...e, approved: true }
                : e
            )
          );
        },
      };

      setEscrows((prevEscrows) => [...prevEscrows, escrow]);
    } catch (error) {
      console.error("Failed to deploy contract", error);
    }
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Wei)
          <input type="text" id="wei" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
