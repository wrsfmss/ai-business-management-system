#!/bin/bash


echo "=== Apple iMac Hardware Compatibility Check ==="
echo "Checking hardware compatibility for Proxmox VE 9 installation"

echo "=== CPU Information ==="
CPU_INFO=$(lscpu)
echo "$CPU_INFO"

echo "=== Virtualization Support ==="
if grep -q "vmx\|svm" /proc/cpuinfo; then
    echo "✓ Hardware virtualization supported"
    VT_SUPPORT=true
else
    echo "✗ Hardware virtualization NOT supported"
    VT_SUPPORT=false
fi

echo "=== Memory Information ==="
MEMORY_INFO=$(free -h)
echo "$MEMORY_INFO"
TOTAL_MEMORY=$(free -m | awk 'NR==2{printf "%.0f", $2/1024}')
echo "Total Memory: ${TOTAL_MEMORY}GB"

if [ "$TOTAL_MEMORY" -ge 16 ]; then
    echo "✓ Sufficient memory for AI workloads (${TOTAL_MEMORY}GB >= 16GB)"
    MEMORY_OK=true
else
    echo "⚠ Limited memory for AI workloads (${TOTAL_MEMORY}GB < 16GB recommended)"
    MEMORY_OK=false
fi

echo "=== Storage Information ==="
STORAGE_INFO=$(df -h)
echo "$STORAGE_INFO"
ROOT_SPACE=$(df / | awk 'NR==2 {print $4}' | sed 's/G//')
echo "Available root space: ${ROOT_SPACE}GB"

if [ "$ROOT_SPACE" -ge 100 ]; then
    echo "✓ Sufficient storage space (${ROOT_SPACE}GB >= 100GB)"
    STORAGE_OK=true
else
    echo "⚠ Limited storage space (${ROOT_SPACE}GB < 100GB recommended)"
    STORAGE_OK=false
fi

echo "=== Network Interfaces ==="
NETWORK_INFO=$(ip link show)
echo "$NETWORK_INFO"
INTERFACE_COUNT=$(ip link show | grep -c "state UP")
echo "Active network interfaces: $INTERFACE_COUNT"

echo "=== Apple Hardware Detection ==="
if dmesg | grep -i apple; then
    echo "✓ Apple hardware detected"
    APPLE_HW=true
else
    echo "ℹ No specific Apple hardware signatures found"
    APPLE_HW=false
fi

echo "=== GPU Information ==="
if lspci | grep -i vga; then
    echo "GPU Information:"
    lspci | grep -i vga
    GPU_PRESENT=true
else
    echo "No discrete GPU detected"
    GPU_PRESENT=false
fi

if lspci | grep -i intel | grep -i graphics; then
    echo "✓ Intel integrated graphics detected"
    INTEL_GPU=true
else
    INTEL_GPU=false
fi

if lspci | grep -i amd | grep -i graphics; then
    echo "✓ AMD graphics detected"
    AMD_GPU=true
else
    AMD_GPU=false
fi

echo ""
echo "=== COMPATIBILITY REPORT ==="
echo "================================"

if [ "$VT_SUPPORT" = true ] && [ "$MEMORY_OK" = true ] && [ "$STORAGE_OK" = true ]; then
    echo "✓ COMPATIBLE: System meets requirements for Proxmox VE 9"
    OVERALL_COMPATIBLE=true
else
    echo "⚠ PARTIAL COMPATIBILITY: Some requirements not met"
    OVERALL_COMPATIBLE=false
fi

echo ""
echo "Requirements Summary:"
echo "- Virtualization Support: $([ "$VT_SUPPORT" = true ] && echo "✓ YES" || echo "✗ NO")"
echo "- Memory (16GB+): $([ "$MEMORY_OK" = true ] && echo "✓ YES (${TOTAL_MEMORY}GB)" || echo "⚠ LIMITED (${TOTAL_MEMORY}GB)")"
echo "- Storage (100GB+): $([ "$STORAGE_OK" = true ] && echo "✓ YES (${ROOT_SPACE}GB)" || echo "⚠ LIMITED (${ROOT_SPACE}GB)")"
echo "- Apple Hardware: $([ "$APPLE_HW" = true ] && echo "✓ DETECTED" || echo "ℹ NOT DETECTED")"
echo "- GPU Support: $([ "$GPU_PRESENT" = true ] && echo "✓ AVAILABLE" || echo "ℹ INTEGRATED ONLY")"

echo ""
echo "=== RECOMMENDATIONS ==="
if [ "$OVERALL_COMPATIBLE" = true ]; then
    echo "✓ Proceed with Proxmox VE 9 installation"
    echo "✓ System is suitable for AI Business Management workloads"
    echo "✓ Can support multiple VMs with Windows 11 and macOS"
else
    echo "⚠ Consider hardware upgrades before installation:"
    [ "$VT_SUPPORT" = false ] && echo "  - Enable virtualization in BIOS/UEFI"
    [ "$MEMORY_OK" = false ] && echo "  - Upgrade memory to at least 32GB for optimal AI performance"
    [ "$STORAGE_OK" = false ] && echo "  - Add additional storage (SSD recommended)"
fi

echo ""
echo "=== AI WORKLOAD OPTIMIZATION ==="
echo "For PhD-level business management AI with IQ 300 capabilities:"
echo "- Recommended: 64GB+ RAM for 20+ AI models"
echo "- Recommended: NVMe SSD storage for model loading"
echo "- Recommended: Dedicated GPU for AI acceleration"
echo "- Network: Gigabit Ethernet minimum for multi-AI coordination"

exit $([ "$OVERALL_COMPATIBLE" = true ] && echo 0 || echo 1)
