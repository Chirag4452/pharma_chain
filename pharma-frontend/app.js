const contractAddress = "0xDD6Ca0C02b2159959B4a42A155341167888311F2";        
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
        "name": "fraudDetected",
        "type": "bool"
      }
    ],
    "name": "FraudDetected",
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
      },
      {
        "internalType": "bool",
        "name": "fraudDetected",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "registrationTimestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "manufacturerRegistrationCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
    "name": "markAsFraudulent",
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
        "name": "name",
        "type": "string"
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
      },
      {
        "internalType": "bool",
        "name": "fraudDetected",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "registrationTimestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_manufacturer",
        "type": "address"
      }
    ],
    "name": "getManufacturerRegistrationCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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

  if (!batchNumber || !name || !manufacturer) {
      alert("Please enter all details.");
      return;
  }

  try {
      // First, check for potential fraud using the AI backend
      const fraudCheck = await checkForFraud({
          batchNumber: parseInt(batchNumber),
          name: name,
          manufacturer: manufacturer,
          timestamp: new Date().toISOString()
      });

      const accounts = await web3.eth.getAccounts();
      
      // Store manufacturer name in localStorage
      const manufacturerKey = `manufacturer_${batchNumber}`;
      localStorage.setItem(manufacturerKey, manufacturer);
      
      await contract.methods.registerDrug(batchNumber, name).send({ from: accounts[0] });

      if (fraudCheck.is_fraud) {
          // If fraud is detected, mark the drug as fraudulent
          await contract.methods.markAsFraudulent(batchNumber).send({ from: accounts[0] });
          alert("Drug registered but flagged for potential fraud!");
      } else {
          alert("Drug registered successfully!");
      }
  } catch (error) {
      console.error("Error registering drug:", error);
      alert("Transaction failed. Check the console for details.");
  }
}

// Check for fraud using AI backend
async function checkForFraud(drugData) {
    try {
        const response = await fetch('http://localhost:5000/api/detect-fraud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(drugData)
        });
        return await response.json();
    } catch (error) {
        console.error("Error checking for fraud:", error);
        return { is_fraud: false, confidence: 0 };
    }
}

// Get Drug Details
async function getDrugDetails() {
  const batchNumber = document.getElementById("searchBatchNumber").value;

  if (!batchNumber) {
      alert("Please enter a batch number.");
      return;
  }

  try {
      const drug = await contract.methods.getDrug(batchNumber).call();
      console.log("Fetched Drug Details:", drug);
      
      // Convert UNIX timestamp to IST (UTC+5:30)
      const timestamp = parseInt(drug[4]);
      const date = new Date(timestamp * 1000);
      
      // Add 5 hours and 30 minutes for IST
      date.setHours(date.getHours() + 5);
      date.setMinutes(date.getMinutes() + 30);
      
      const istTime = date.toLocaleString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
      });
      
      // Get manufacturer name from localStorage if available
      const manufacturerKey = `manufacturer_${batchNumber}`;
      const manufacturerName = localStorage.getItem(manufacturerKey) || "Unknown";
      
      // Update the drug details in the new structure
      document.getElementById("drugName").textContent = drug[0];
      
      // Show both manufacturer name and blockchain address
      document.getElementById("manufacturerName").textContent = manufacturerName;
      document.getElementById("manufacturerAddress").textContent = drug[1];
      
      // Add fraud detection status
      const fraudStatus = document.getElementById("fraudStatus");
      if (drug[3]) {
          fraudStatus.textContent = "🚨 Fraud Detected";
          fraudStatus.style.color = "#dc3545";
      } else {
          fraudStatus.textContent = "✓ No Fraud Detected";
          fraudStatus.style.color = "#28a745";
      }
      
      // Update registration time with IST
      document.getElementById("registrationTime").textContent = istTime + " (IST)";
      
      // Show the details container
      document.getElementById("drugDetails").style.display = "block";
  } catch (error) {
      console.error("Error fetching drug details:", error);
      alert("Failed to fetch drug details. Check the console for errors.");
  }
}

window.onload = initWeb3;
