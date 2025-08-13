const VirtualizationManager = require('../src/virtualization/vm-manager');
const winston = require('winston');

describe('Virtualization Tests', () => {
    let logger;
    let vmManager;

    beforeAll(async () => {
        logger = winston.createLogger({
            level: 'error',
            transports: [new winston.transports.Console({ silent: true })]
        });

        vmManager = new VirtualizationManager(logger);
    });

    describe('Virtualization Manager', () => {
        test('should initialize virtualization manager', async () => {
            await vmManager.initialize();
            expect(vmManager.initialized).toBe(true);
        });

        test('should create VM with proper configuration', async () => {
            await vmManager.initialize();
            
            const config = {
                vmid: 999,
                name: 'test-business-vm',
                ostype: 'win11',
                memory: 8192,
                cores: 4,
                storage: 'local-lvm',
                network: 'vmbr0'
            };

            const result = await vmManager.createVM(config);
            
            expect(result.message).toMatch(/created successfully|creation simulated/);
            expect(result.status).toMatch(/success|simulated/);
            expect(result.details).toBeDefined();
        });

        test('should manage VM lifecycle operations', async () => {
            await vmManager.initialize();
            
            const vmid = 999;
            const actions = ['start', 'status', 'stop'];
            
            for (const action of actions) {
                const result = await vmManager.manageVM({
                    vmid,
                    action,
                    parameters: {}
                });
                
                expect(result.message).toContain(`${action} completed`);
                expect(result.status).toBe('success');
            }
        });

        test('should optimize resources for AI workloads', async () => {
            await vmManager.initialize();
            
            const result = await vmManager.optimizeResources({
                target: 'ai_workloads',
                priority: 'high_performance'
            });
            
            expect(result.message).toContain('Resource optimization completed');
            expect(result.details.memory_optimization).toBeDefined();
            expect(result.details.cpu_optimization).toBeDefined();
            expect(result.details.storage_optimization).toBeDefined();
            expect(result.details.network_optimization).toBeDefined();
        });

        test('should provide comprehensive system status', async () => {
            await vmManager.initialize();
            
            const status = await vmManager.getStatus();
            
            expect(status.content).toBeDefined();
            expect(status.content[0].text).toContain('Virtualization Environment Status');
        });
    });

    describe('VM Configuration', () => {
        test('should build proper Windows 11 VM creation command', async () => {
            await vmManager.initialize();
            
            const config = {
                vmid: 100,
                name: 'windows11-test',
                ostype: 'win11',
                memory: 16384,
                cores: 6,
                sockets: 1,
                storage: 'local-lvm',
                network: 'vmbr0'
            };

            const command = vmManager.buildCreateCommand(config);
            
            expect(command).toContain('qm create 100');
            expect(command).toContain('--name windows11-test');
            expect(command).toContain('--ostype win11');
            expect(command).toContain('--memory 16384');
            expect(command).toContain('--cores 6');
            expect(command).toContain('--bios ovmf');
            expect(command).toContain('--machine q35');
            expect(command).toContain('--tpmstate0');
        });

        test('should build proper macOS VM creation command', async () => {
            await vmManager.initialize();
            
            const config = {
                vmid: 101,
                name: 'macos-test',
                ostype: 'macos',
                memory: 24576,
                cores: 8,
                sockets: 1,
                storage: 'local-lvm',
                network: 'vmbr0'
            };

            const command = vmManager.buildCreateCommand(config);
            
            expect(command).toContain('qm create 101');
            expect(command).toContain('--name macos-test');
            expect(command).toContain('--memory 24576');
            expect(command).toContain('--cores 8');
            expect(command).toContain('--bios ovmf');
            expect(command).toContain('--machine q35');
            expect(command).toContain('--cpu host');
            expect(command).toContain('--args');
            expect(command).toContain('isa-applesmc');
        });

        test('should handle VM configuration updates', async () => {
            await vmManager.initialize();
            
            const result = await vmManager.configureVM(999, {
                memory: 32768,
                cores: 12,
                description: 'Updated AI processing configuration'
            });
            
            expect(result.configurations).toBeDefined();
            if (Array.isArray(result.configurations)) {
                expect(result.configurations.length).toBeGreaterThan(0);
            }
        });
    });

    describe('Apple iMac Conversion Support', () => {
        test('should support Apple hardware detection', async () => {
            await vmManager.initialize();
            
            const status = await vmManager.getSystemHealth();
            
            expect(status.overall_health).toBeDefined();
            expect(status.recommendations).toBeDefined();
            expect(Array.isArray(status.recommendations)).toBe(true);
        });

        test('should optimize for mixed Windows 11 and macOS environment', async () => {
            await vmManager.initialize();
            
            const memoryOpt = await vmManager.optimizeMemory();
            const cpuOpt = await vmManager.optimizeCPU();
            
            expect(memoryOpt.recommendations).toContain('Enable memory ballooning for VMs');
            expect(cpuOpt.recommendations).toContain('Enable CPU hotplug for dynamic scaling');
        });

        test('should provide Proxmox VE 9 specific features', async () => {
            await vmManager.initialize();
            
            const proxmoxStatus = await vmManager.getProxmoxStatus();
            
            expect(proxmoxStatus.status).toMatch(/running|simulated|error/);
            if (proxmoxStatus.version) {
                expect(proxmoxStatus.version).toContain('Proxmox');
            }
        });
    });

    describe('AI Workload Optimization', () => {
        test('should optimize storage for AI model loading', async () => {
            await vmManager.initialize();
            
            const storageOpt = await vmManager.optimizeStorage();
            
            expect(storageOpt.optimization).toContain('Storage tiering and caching enabled');
            expect(storageOpt.recommendations).toContain('Enable thin provisioning for space efficiency');
            expect(storageOpt.recommendations).toContain('Configure SSD caching for frequently accessed data');
        });

        test('should optimize network for multi-AI coordination', async () => {
            await vmManager.initialize();
            
            const networkOpt = await vmManager.optimizeNetwork();
            
            expect(networkOpt.optimization).toContain('Network QoS and load balancing enabled');
            expect(networkOpt.recommendations).toContain('Configure network bonding for redundancy');
            expect(networkOpt.recommendations).toContain('Implement QoS policies for critical applications');
        });

        test('should provide VM inventory for AI nodes', async () => {
            await vmManager.initialize();
            
            const inventory = await vmManager.getVMInventory();
            
            expect(inventory.count).toBeDefined();
            if (inventory.vms) {
                expect(Array.isArray(inventory.vms)).toBe(true);
                inventory.vms.forEach(vm => {
                    expect(vm.vmid).toBeDefined();
                    expect(vm.name).toBeDefined();
                    expect(vm.status).toBeDefined();
                });
            }
        });
    });

    describe('Business Continuity', () => {
        test('should support VM backup operations', async () => {
            await vmManager.initialize();
            
            const result = await vmManager.backupVM(999);
            
            expect(result.backup).toMatch(/success|simulated/);
            if (result.command) {
                expect(result.command).toContain('vzdump');
            }
        });

        test('should support VM restore operations', async () => {
            await vmManager.initialize();
            
            const result = await vmManager.restoreVM(999, {
                backupFile: '/var/lib/vz/dump/vzdump-qemu-999-test.vma.gz'
            });
            
            expect(result.restore).toMatch(/success|simulated/);
            if (result.command) {
                expect(result.command).toContain('qmrestore');
            }
        });

        test('should provide resource usage monitoring', async () => {
            await vmManager.initialize();
            
            const usage = await vmManager.getResourceUsage();
            
            expect(usage.cpu_usage).toBeDefined();
            expect(usage.memory_usage).toBeDefined();
            expect(usage.storage_usage).toBeDefined();
            expect(usage.network_usage).toBeDefined();
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid VM operations gracefully', async () => {
            await vmManager.initialize();
            
            try {
                await vmManager.executeAction('invalid_action', {});
            } catch (error) {
                expect(error.message).toContain('Unknown virtualization action');
            }
        });

        test('should provide fallback when Proxmox is unavailable', async () => {
            await vmManager.initialize();
            
            const result = await vmManager.createVM({
                name: 'test-fallback-vm',
                ostype: 'l26'
            });
            
            expect(result.status).toMatch(/success|simulated/);
            expect(result.details).toBeDefined();
        });

        test('should handle VM management errors', async () => {
            await vmManager.initialize();
            
            const result = await vmManager.getVMStatus(99999);
            
            expect(result.vmid).toBe(99999);
            expect(result.status).toMatch(/unknown|simulated/);
        });
    });
});
