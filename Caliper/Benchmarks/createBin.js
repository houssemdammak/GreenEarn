test:
  name: "Waste Management Benchmark"
  description: "Testing the createBin function of the WasteManagement contract"
  workers:
    type: local
    number: 1

blockchain:
  connector: ethereum

testRounds:
  - label: "Create Bin Transactions"
    description: "Execute the createBin function with predefined arguments"
    txNumber: 100
    rateControl:
      type: fixed-rate
      opts:
        tps: 10
    arguments:
      location: "City A"
      capacity: 100
      currentWeight: 0
    callback: |
      module.exports.createBin = async function (context, args) {
          const contract = context.contracts.get('WasteManagement');
          const tx = await contract.createBin(args.location, args.capacity, args.currentWeight);
          await tx.wait();
      };
