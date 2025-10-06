FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install system dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    build-essential \
    curl \
    git \
    jq \
    vim \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Security Layer: Configure firewall rules (optional - enable if needed)
# RUN apt-get update && apt-get install -y iptables \
#     && iptables -A OUTPUT -d anthropic.com -j ACCEPT \
#     && iptables -A OUTPUT -d github.com -j ACCEPT \
#     && iptables -A OUTPUT -d npmjs.org -j ACCEPT

# Set up non-root user (vscode user is created by base image)
USER vscode

# Install global npm packages for the user
RUN npm install -g npm@latest

# Create workspace directory structure
RUN mkdir -p /home/vscode/.anthropic

# Set working directory
WORKDIR /workspaces

# Environment variables
ENV NODE_ENV=development
ENV PATH="/home/vscode/.local/bin:${PATH}"
