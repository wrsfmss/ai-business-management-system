#!/bin/bash


set -e

echo "=== Creating VM Templates for AI Business Management System ==="

WINDOWS11_TEMPLATE_ID=9000
MACOS_TEMPLATE_ID=9001
AI_PROCESSING_TEMPLATE_ID=9002

echo "=== Creating Windows 11 Business Template ==="
qm create $WINDOWS11_TEMPLATE_ID \
    --name "windows11-business-template" \
    --ostype win11 \
    --memory 8192 \
    --cores 4 \
    --sockets 1 \
    --cpu host \
    --net0 virtio,bridge=vmbr0 \
    --scsi0 local-lvm:32,format=qcow2 \
    --scsi1 local-lvm:100,format=qcow2 \
    --ide2 local:iso/windows11-business.iso,media=cdrom \
    --boot order=ide2 \
    --bios ovmf \
    --machine q35 \
    --efidisk0 local-lvm:1,format=raw,efitype=4m,pre-enrolled-keys=1 \
    --tpmstate0 local-lvm:4,version=v2.0 \
    --agent enabled=1 \
    --description "Windows 11 Business Template for AI Management System
    
Optimized for:
- Business management applications
- AI model integration
- Executive dashboard access
- Multi-AI coordination
- PhD-level business operations

User: William Smiley
Purpose: Business Executive Directors Board operations"

echo "Windows 11 template created with ID: $WINDOWS11_TEMPLATE_ID"

echo "=== Creating macOS Business Template ==="
qm create $MACOS_TEMPLATE_ID \
    --name "macos-business-template" \
    --ostype other \
    --memory 16384 \
    --cores 8 \
    --sockets 1 \
    --cpu Penryn,kvm=on,vendor=GenuineIntel,+kvm_pv_unhalt,+kvm_pv_eoi,+hypervisor,+invtsc,+pcid,+ssse3,+sse4.2,+popcnt,+avx,+avx2,+aes,+fma,+fma4,+bmi1,+bmi2,+xsave,+xsaveopt,check \
    --net0 virtio,bridge=vmbr0 \
    --scsi0 local-lvm:64,format=qcow2 \
    --scsi1 local-lvm:200,format=qcow2 \
    --ide2 local:iso/macos-monterey.iso,media=cdrom \
    --boot order=ide2 \
    --bios ovmf \
    --machine q35 \
    --efidisk0 local-lvm:1,format=raw,efitype=4m \
    --args "-device isa-applesmc,osk=\"ourhardworkbythesewordsguardedpleasedontsteal(c)AppleComputerInc\" -smbios type=2 -device usb-kbd,bus=ehci.0,port=2 -global nec-usb-xhci.msi=off -global ICH9-LPC.acpi-pci-hotplug-with-bridge-support=off -cpu Penryn,kvm=on,vendor=GenuineIntel,+invtsc,vmware-cpuid-freq=on,+pcid,+ssse3,+sse4.2,+popcnt,+avx,+aes,+xsave,+xsaveopt,+avx2,+bmi2,+smep,+bmi1,+fma,+movbe,+xsaveopt,check" \
    --agent enabled=1 \
    --description "macOS Business Template for AI Management System

Optimized for:
- macOS business applications
- AI development tools
- Creative business solutions
- Cross-platform AI integration
- Executive productivity suite

User: William Smiley
Purpose: Mixed OS business environment
Note: Requires macOS installation media and proper licensing"

echo "macOS template created with ID: $MACOS_TEMPLATE_ID"

echo "=== Creating AI Processing Node Template ==="
qm create $AI_PROCESSING_TEMPLATE_ID \
    --name "ai-processing-node-template" \
    --ostype l26 \
    --memory 32768 \
    --cores 16 \
    --sockets 1 \
    --cpu host \
    --net0 virtio,bridge=vmbr0 \
    --net1 virtio,bridge=vmbr1 \
    --scsi0 local-lvm:100,format=qcow2 \
    --scsi1 local-lvm:500,format=qcow2 \
    --ide2 local:iso/ubuntu-22.04-server.iso,media=cdrom \
    --boot order=ide2 \
    --agent enabled=1 \
    --description "AI Processing Node Template

Optimized for:
- 20+ AI model hosting
- PhD-level business analysis
- IQ 300 analytical processing
- Multi-AI coordination
- Executive board swarm council
- High-performance AI workloads

Specifications:
- 32GB RAM for AI models
- 16 CPU cores for parallel processing
- Dual network interfaces
- Large storage for AI models and data

User: William Smiley
Purpose: Core AI processing infrastructure"

echo "AI Processing Node template created with ID: $AI_PROCESSING_TEMPLATE_ID"

echo "=== Converting VMs to Templates ==="
qm template $WINDOWS11_TEMPLATE_ID
qm template $MACOS_TEMPLATE_ID
qm template $AI_PROCESSING_TEMPLATE_ID

echo "All templates converted successfully"

cat > /usr/local/bin/create-business-vm << 'EOF'
#!/bin/bash


TYPE=$1
VMID=$2
NAME=$3

if [ -z "$TYPE" ] || [ -z "$VMID" ] || [ -z "$NAME" ]; then
    echo "Usage: create-business-vm <windows11|macos|ai-node> <vmid> <name>"
    exit 1
fi

case $TYPE in
    windows11)
        TEMPLATE_ID=9000
        echo "Creating Windows 11 business VM from template..."
        ;;
    macos)
        TEMPLATE_ID=9001
        echo "Creating macOS business VM from template..."
        ;;
    ai-node)
        TEMPLATE_ID=9002
        echo "Creating AI processing node from template..."
        ;;
    *)
        echo "Invalid type. Use: windows11, macos, or ai-node"
        exit 1
        ;;
esac

qm clone $TEMPLATE_ID $VMID --name "$NAME" --full

echo "VM $NAME created with ID $VMID from $TYPE template"
echo "Configure and start the VM:"
echo "  qm set $VMID --memory <memory_mb>"
echo "  qm set $VMID --cores <cpu_cores>"
echo "  qm start $VMID"
EOF

chmod +x /usr/local/bin/create-business-vm

echo "=== Template Creation Complete ==="
echo "Available templates:"
echo "- Windows 11 Business: ID $WINDOWS11_TEMPLATE_ID"
echo "- macOS Business: ID $MACOS_TEMPLATE_ID"
echo "- AI Processing Node: ID $AI_PROCESSING_TEMPLATE_ID"
echo ""
echo "Use 'create-business-vm <type> <vmid> <name>' to create VMs from templates"
echo "Example: create-business-vm windows11 100 william-smiley-desktop"
