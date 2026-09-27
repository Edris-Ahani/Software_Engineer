# Cloud Computing Models

## What is it?
Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, and analytics—over the Internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale.

## The Three Main Service Models
1. **IaaS (Infrastructure as a Service)**: 
   - *What it is*: You rent IT infrastructure—servers and virtual machines (VMs), storage, networks, operating systems—on a pay-as-you-go basis.
   - *Analogy*: Leasing a plot of land and building a house yourself.
   - *Examples*: AWS EC2, Google Compute Engine, DigitalOcean Droplets.
2. **PaaS (Platform as a Service)**:
   - *What it is*: Supplies an on-demand environment for developing, testing, delivering, and managing software applications. You don't worry about the underlying OS or servers.
   - *Analogy*: Renting an unfurnished house (you just bring your furniture/code).
   - *Examples*: Heroku, AWS Elastic Beanstalk, Vercel, Google App Engine.
3. **SaaS (Software as a Service)**:
   - *What it is*: A method for delivering software applications over the Internet, on demand and typically on a subscription basis.
   - *Analogy*: Renting a fully furnished house with ongoing maintenance.
   - *Examples*: Google Workspace, Slack, Dropbox.

## Serverless Computing (FaaS)
An overlapping model with PaaS is **Serverless** or **FaaS (Function as a Service)**.
- You write code in functions (e.g., Node.js or Python).
- The cloud provider completely manages starting, running, and stopping the container for that function.
- You pay *only* for the exact milliseconds your code runs.
- *Examples*: AWS Lambda, Google Cloud Functions.

## Why Should Backend Developers Care?
Modern backend applications rarely run on bare-metal servers in a local basement. Understanding how to leverage cloud services, specifically PaaS and Serverless, allows you to deploy scalable applications globally in minutes without hiring an entire IT operations team.
