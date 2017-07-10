using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.AspNetCore.Authorization;
using CaseSite.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CaseSite.Controllers
{
    [Route("api/blob")]
    public class BlobController : Controller
    {
        CloudBlobClient blobClient;
        private readonly UnifactoContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public BlobController(UnifactoContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=unifacto;AccountKey=Gj0ZZxfVI1+0hfhlf8tnQxnBHGx0WOFZ8i/rGbtTvyyStQrij1rnyt1ujiqpQWHct8slY/GoEPWOQwBkglFy4Q==;EndpointSuffix=core.windows.net");
            blobClient = storageAccount.CreateCloudBlobClient();
        }

        // POST api/values
        [HttpPost("uploadLogo/{id}")]
        [Authorize]
        public async Task<IActionResult> Post([FromRoute] int id)
        {

            var business = await _context.Business.SingleOrDefaultAsync(b => b.Id == id);

            if (business == null)
            {
                return NotFound(new { businessError = "business not found" });
            }

            var httpRequest = HttpContext.Request;
            if(httpRequest.Form.Files.Count > 0)
            {
                var file = httpRequest.Form.Files[0];
                CloudBlobContainer container = blobClient.GetContainerReference("unifactoblobcontainer");
                await container.CreateIfNotExistsAsync();
                CloudBlobDirectory logoDirectory = container.GetDirectoryReference(business.Id.ToString()).GetDirectoryReference("logo");

                var blobs = (await logoDirectory.ListBlobsSegmentedAsync(true, BlobListingDetails.None, 500, null, null, null)).Results;

                foreach (var blob in blobs)
                {
                    await ((CloudBlob)blob).DeleteIfExistsAsync();
                }

                CloudBlockBlob blockBlob = container.GetBlockBlobReference(business.Id + @"/logo/" + file.FileName);
                await blockBlob.UploadFromStreamAsync(file.OpenReadStream());
                business.LogoUrl = blockBlob.Uri.ToString();
                _context.Entry(business).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(business.LogoUrl);
            }
            return NotFound();
        }
        
    }
}
