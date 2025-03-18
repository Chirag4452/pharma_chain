const contractAddress = "0x612610554Eb6f09Ef0812312228CF539F5a52bAA";
        const contractABI = [
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "batchNumber",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "manufacturer",
                  "type": "address"
                }
              ],
              "name": "DrugRegistered",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "batchNumber",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "bool",
                  "name": "verified",
                  "type": "bool"
                }
              ],
              "name": "DrugVerified",
              "type": "event"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "drugs",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "batchNumber",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "manufacturer",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "verified",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function",
              "constant": true
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_batchNumber",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "_name",
                  "type": "string"
                }
              ],
              "name": "registerDrug",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_batchNumber",
                  "type": "uint256"
                }
              ],
              "name": "verifyDrug",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_batchNumber",
                  "type": "uint256"
                }
              ],
              "name": "getDrug",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                },
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function",
              "constant": true
            }
          ];
let web3;
let contract;

// Initialize Web3
async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
        alert("Please install MetaMask!");
        return;
    }

    const accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log("Connected to contract:", contract);
}

// Register a Drug
async function registerDrug() {
    const batchNumber = document.getElementById("batchNumber").value;
    const name = document.getElementById("name").value;
    const manufacturer = document.getElementById("manufacturer").value;

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.registerDrug(batchNumber, name, manufacturer).send({ from: accounts[0] });
        alert("Drug registered successfully!");
    } catch (error) {
        console.error("Error registering drug:", error);
    }
}

// Get Drug Details
async function getDrugDetails() {
    const batchNumber = document.getElementById("searchBatchNumber").value;

    try {
        const drug = await contract.methods.getDrug(batchNumber).call();
        document.getElementById("drugDetails").innerText =
            `Name: ${drug[0]}, Manufacturer: ${drug[1]}, Verified: ${drug[2]}`;
    } catch (error) {
        console.error("Error fetching drug details:", error);
    }
}

window.onload = initWeb3;
