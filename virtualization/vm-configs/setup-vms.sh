#!/bin/bash


set -e

echo "=== Setting up VMs for AI Business Management System ==="
echo "User: William Smiley"
echo "Purpose: Business Executive Directors Board Swarm Council"

WINDOWS11_VMID=100
MACOS_VMID=101
AI_NODE1_VMID=102
AI_NODE2_VMID=103
AI_NODE3_VMID=104

echo "=== Creating Windows 11 Business Desktop ==="
if ! qm status $WINDOWS11_VMID >/dev/null 2>&1; then
    create-business-vm windows11 $WINDOWS11_VMID "william-smiley-desktop"
    
    qm set $WINDOWS11_VMID \
        --memory 16384 \
        --cores 6 \
        --description "William Smiley's Windows 11 Business Desktop

Primary workstation for:
- Executive business operations
- AI system management
- Business intelligence dashboards
- Multi-AI coordination interface
- PhD-level business analysis tools

Optimized for IQ 300 analytical capabilities"

    echo "Windows 11 desktop configured for William Smiley"
else
    echo "Windows 11 VM already exists (ID: $WINDOWS11_VMID)"
fi

echo "=== Creating macOS Creative Workstation ==="
if ! qm status $MACOS_VMID >/dev/null 2>&1; then
    create-business-vm macos $MACOS_VMID "william-smiley-macos"
    
    qm set $MACOS_VMID \
        --memory 24576 \
        --cores 8 \
        --description "William Smiley's macOS Creative Workstation

Specialized for:
- Creative business content
- Presentation development
- Cross-platform AI integration
- Executive communication tools
- Business media production

Mixed OS environment support"

    echo "macOS workstation configured for creative business operations"
else
    echo "macOS VM already exists (ID: $MACOS_VMID)"
fi

echo "=== Creating AI Processing Nodes ==="

if ! qm status $AI_NODE1_VMID >/dev/null 2>&1; then
    create-business-vm ai-node $AI_NODE1_VMID "ai-coordination-primary"
    
    qm set $AI_NODE1_VMID \
        --memory 49152 \
        --cores 12 \
        --description "Primary AI Coordination Node

Hosts:
- MCP Server (main)
- GPT-5, Claude, Abacus.AI
- Executive Board Swarm Council
- Business Operations Manager
- Coordination Engine

Role: Central AI coordination and decision-making"

    echo "Primary AI coordination node configured"
else
    echo "Primary AI node already exists (ID: $AI_NODE1_VMID)"
fi

if ! qm status $AI_NODE2_VMID >/dev/null 2>&1; then
    create-business-vm ai-node $AI_NODE2_VMID "ai-models-specialized"
    
    qm set $AI_NODE2_VMID \
        --memory 32768 \
        --cores 10 \
        --description "Specialized AI Models Node

Hosts:
- Genspark.AI, Manus.AI, STORM
- Financial AI, Operations AI
- Marketing AI, HR AI, Legal AI
- Innovation AI, Strategy AI

Role: Specialized domain expertise AI models"

    echo "Specialized AI models node configured"
else
    echo "Specialized AI node already exists (ID: $AI_NODE2_VMID)"
fi

if ! qm status $AI_NODE3_VMID >/dev/null 2>&1; then
    create-business-vm ai-node $AI_NODE3_VMID "ai-research-analytics"
    
    qm set $AI_NODE3_VMID \
        --memory 32768 \
        --cores 10 \
        --description "Research and Analytics AI Node

Hosts:
- Perplexity AI, Google Gemini
- Cohere, Mistral AI, Together AI
- Hugging Face models, Replicate
- Research synthesis engines

Role: Research, analytics, and knowledge synthesis"

    echo "Research and analytics AI node configured"
else
    echo "Research AI node already exists (ID: $AI_NODE3_VMID)"
fi

echo "=== Configuring AI Network Coordination ==="
cat > /etc/pve/firewall/cluster.fw << EOF
[OPTIONS]
enable: 1
policy_in: DROP
policy_out: ACCEPT

[RULES]
IN ACCEPT -p tcp -dport 22 -source 192.168.1.0/24 # SSH
IN ACCEPT -p tcp -dport 8006 -source 192.168.1.0/24 # Proxmox Web UI
IN ACCEPT -p tcp -dport 3000 -source 192.168.1.0/24 # MCP Server
IN ACCEPT -p tcp -dport 5900:5999 -source 192.168.1.0/24 # VNC
IN ACCEPT -p tcp -dport 3128 -source 10.0.0.0/24 # AI Model Communication
IN ACCEPT -p tcp -dport 8080:8090 -source 10.0.0.0/24 # AI Services
IN ACCEPT -p tcp -dport 9000:9010 -source 10.0.0.0/24 # Executive Board Communication

IN ACCEPT -source 192.168.1.102 # AI Node 1
IN ACCEPT -source 192.168.1.103 # AI Node 2  
IN ACCEPT -source 192.168.1.104 # AI Node 3
EOF

cat > /usr/local/bin/start-ai-business-system << 'EOF'
#!/bin/bash

echo "=== Starting AI Business Management System ==="
echo "User: William Smiley"
echo "System: PhD-level Business Operations with IQ 300 capabilities"

echo "Starting Windows 11 Business Desktop..."
qm start 100

echo "Starting macOS Creative Workstation..."
qm start 101

echo "Starting AI Coordination Node..."
qm start 102

echo "Starting Specialized AI Models Node..."
qm start 103

echo "Starting Research & Analytics AI Node..."
qm start 104

echo "Waiting for VMs to boot..."
sleep 60

echo "=== AI Business Management System Started ==="
echo "Access points:"
echo "- Windows 11 Desktop: VM 100 (William Smiley workstation)"
echo "- macOS Workstation: VM 101 (Creative business operations)"
echo "- AI Coordination: VM 102 (MCP Server and Executive Board)"
echo "- Specialized AI: VM 103 (Domain expert AI models)"
echo "- Research AI: VM 104 (Research and analytics)"
echo ""
echo "MCP Server will be available at: http://192.168.1.102:3000"
echo "Executive Board Dashboard: http://192.168.1.102:3000/board"
echo ""
echo "System ready for PhD-level business management operations!"
EOF

chmod +x /usr/local/bin/start-ai-business-system

cat > /usr/local/bin/stop-ai-business-system << 'EOF'
#!/bin/bash

echo "=== Stopping AI Business Management System ==="

echo "Stopping AI nodes..."
qm stop 104 # Research AI
qm stop 103 # Specialized AI
qm stop 102 # AI Coordination

echo "Stopping user workstations..."
qm stop 101 # macOS
qm stop 100 # Windows 11

echo "AI Business Management System stopped"
EOF

chmod +x /usr/local/bin/stop-ai-business-system

echo "=== VM Setup Complete ==="
echo ""
echo "Created VMs:"
echo "- VM 100: William Smiley Windows 11 Desktop"
echo "- VM 101: William Smiley macOS Workstation"
echo "- VM 102: AI Coordination Primary Node"
echo "- VM 103: Specialized AI Models Node"
echo "- VM 104: Research & Analytics AI Node"
echo ""
echo "Management commands:"
echo "- start-ai-business-system: Start all VMs"
echo "- stop-ai-business-system: Stop all VMs"
echo ""
echo "Next steps:"
echo "1. Install operating systems on VMs"
echo "2. Configure AI software on processing nodes"
echo "3. Deploy MCP server and AI models"
echo "4. Set up executive dashboard and interfaces"
