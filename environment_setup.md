# Development Environment Setup

This document provides instructions for setting up your local development environment for the kube-trucker application. We will be installing Docker Desktop and Kind (Kubernetes in Docker).

## 1. Install Docker Desktop

Docker Desktop is required to run Docker containers, which Kind uses as "nodes" for the Kubernetes cluster.

1.  **Download Docker Desktop**: Go to the official Docker Desktop website: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2.  **Install Docker Desktop**:
    *   Download the installer for Windows.
    *   Run the installer and follow the on-screen instructions. Ensure that "Install required Windows components for WSL 2" is checked during installation, as Kind often leverages WSL 2 for better performance.
    *   After installation, restart your computer if prompted.
3.  **Start Docker Desktop**: Launch Docker Desktop from your Start Menu. It might take a few moments to start.
4.  **Verify Installation**: Open a command prompt or PowerShell and run:
    ```bash
    docker --version
    docker compose version
    ```
    You should see the installed versions of Docker and Docker Compose.

## 2. Install Kind

Kind (Kubernetes in Docker) allows you to run local Kubernetes clusters using Docker containers as nodes.

1.  **Install `kubectl`**: `kubectl` is the command-line tool for running commands against Kubernetes clusters.
    *   **Using Chocolatey (Recommended for Windows)**: If you have Chocolatey installed, open an **elevated** PowerShell or Command Prompt and run:
        ```bash
        choco install kubernetes-cli
        ```
    *   **Manual Installation**:
        *   Download the `kubectl` executable: [https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)
        *   Place the `kubectl.exe` file in a directory that is in your system's PATH (e.g., `C:\Program Files\Kubernetes\kubectl`).
2.  **Install Kind**:
    *   **Using Chocolatey (Recommended for Windows)**: Open an **elevated** PowerShell or Command Prompt and run:
        ```bash
        choco install kind
        ```
    *   **Manual Installation**:
        *   Download the Kind executable: [https://kind.sigs.k8s.io/docs/user/quick-start/#installation](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
        *   Place the `kind.exe` file in a directory that is in your system's PATH (e.g., `C:\Program Files\Kind`).
3.  **Create a Kind Cluster**: Open a command prompt or PowerShell and run:
    ```bash
    kind create cluster --name kube-trucker-cluster
    ```
    This command will create a single-node Kubernetes cluster named `kube-trucker-cluster`. This process might take a few minutes as it downloads necessary images and sets up the cluster.
4.  **Verify Kind and Kubernetes**: Once Kind has started, you can check its status and the Kubernetes cluster status:
    ```bash
    kind get clusters
    kubectl cluster-info --context kind-kube-trucker-cluster
    kubectl get nodes
    ```
    You should see output indicating that your `kube-trucker-cluster` is running and your Kubernetes node is ready.

Once these steps are completed, your development environment will be ready for building and deploying our microservices to Kubernetes.