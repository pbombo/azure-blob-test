/**
 * Based on https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-storage-blob/12.1.2/index.html
 */
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
require("dotenv").config();

// Enter your storage account name and shared key
const account = process.env.ACCOUNT;
const accountKey = process.env.ACCOUNT_KEY;

// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only avaiable in Node.js runtime, not in browsers
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);

async function createContainer(containerName) {
  // Create a container
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const createContainerResponse = await containerClient.create();
  console.log(
    `Create container ${containerName} successfully`,
    createContainerResponse.requestId
  );
  return true;
}

async function listAllContainers() {
  let i = 1;
  let iter = await blobServiceClient.listContainers();
  for await (const container of iter) {
    console.log(`Container ${i++}: ${container.name}`);
  }
}

// Add blob to container
async function addBlobToContainer(containerName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const content = "Hello world!";
  const blobName = "newblob" + new Date().getTime();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.upload(
    content,
    content.length
  );
  console.log(
    `Upload block blob ${blobName} successfully`,
    uploadBlobResponse.requestId
  );
}

// List blobs inside a container
async function listBlobsInContainer(containerName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  let i = 1;
  let iter = await containerClient.listBlobsFlat();
  for await (const blob of iter) {
    console.log(`Blob ${i++}: ${blob.name}`);
  }
}

async function main() {
  const containerName = `testcontainer-${new Date().getTime()}`;
  const isCreated = await createContainer(containerName);
  if (isCreated) {
    listAllContainers();
    addBlobToContainer(containerName);
    listBlobsInContainer(containerName);
  }
}

try {
  main();
} catch (error) {
  console.log(error);
}
