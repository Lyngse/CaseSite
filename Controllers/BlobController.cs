using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CaseSite.Controllers
{
    [Route("api/blob")]
    public class BlobController : Controller
    {
        CloudBlobClient blobClient;
        
        BlobController()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=unifacto;AccountKey=Gj0ZZxfVI1+0hfhlf8tnQxnBHGx0WOFZ8i/rGbtTvyyStQrij1rnyt1ujiqpQWHct8slY/GoEPWOQwBkglFy4Q==;EndpointSuffix=core.windows.net");
            blobClient = storageAccount.CreateCloudBlobClient();
        }

        // POST api/values
        [HttpPost("uploadLogo/{id}")]
        public async Task<IActionResult> Post([FromRoute] int id)
        {
            var httpRequest = HttpContext.Request;
            if(httpRequest.Form.Files.Count > 0)
            {
                var file = httpRequest.Form.Files[0];
                CloudBlobContainer container = blobClient.GetContainerReference("unifactoblobcontainer");
                await container.CreateIfNotExistsAsync();
                CloudBlockBlob blockBlob = container.GetBlockBlobReference(id + @"\logo");
                await blockBlob.UploadFromStreamAsync(file.OpenReadStream());
                return Ok(blockBlob.Uri.AbsoluteUri);
            }
            return Ok();
        }
        
    }
}
