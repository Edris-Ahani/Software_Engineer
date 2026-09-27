# Infrastructure as Code (IaC) & Terraform

## What is it?
Infrastructure as Code (IaC) is the managing and provisioning of computer data centers (servers, databases, networks) through machine-readable definition files, rather than through physical hardware configuration or interactive configuration tools (like clicking around in the AWS Web Console).

## Why is it important?
Before IaC, if a company needed a new server, a system administrator had to manually log in, install the OS, configure the network, install dependencies, and set up the database. If that server died, they had to remember exactly what they did to recreate it. 

With IaC, your infrastructure is written in code (just like your app). This solves several massive problems:
1. **Automation & Speed**: Spin up a complete, complex cloud environment in minutes with a single command.
2. **Consistency & No "Drift"**: Eliminates the "it works on my machine" problem at the infrastructure level. Every environment (dev, staging, prod) is exactly the same.
3. **Version Control**: Because infrastructure is now just text files, it can be committed to Git. You can review infrastructure changes via Pull Requests, and roll back if something breaks.

## Key Tools
- **Terraform (HashiCorp)**: The most popular, cloud-agnostic IaC tool. You can use it to provision AWS, Google Cloud, Azure, and even GitHub repositories.
- **Ansible / Chef / Puppet**: Primarily configuration management tools (used to configure the software *inside* the servers once they are provisioned).
- **AWS CloudFormation**: AWS's proprietary IaC tool.

## Example (Terraform - HCL)
Here is how you would provision a simple AWS EC2 server using Terraform's HashiCorp Configuration Language (HCL):

```hcl
# 1. Define the cloud provider
provider "aws" {
  region = "us-west-2"
}

# 2. Define the resource you want to create
resource "aws_instance" "my_web_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Ubuntu OS Image
  instance_type = "t2.micro"              # Server size/power

  tags = {
    Name = "HelloWorldServer"
  }
}
```
When you run `terraform apply`, Terraform talks to the AWS API and creates this exact server for you.
