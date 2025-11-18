/**
 * LinkOS Boot Screen Component
 * Handles both standalone and embedded boot sequences
 */

class LinkOSBootScreen {
    constructor(config = {}) {
        this.progress = 0;
        this.currentMessageIndex = 0;
        this.isFirstVisit = config.isFirstVisit ?? true;
        this.isEmbedded = config.embedded ?? false;
        this.bootConfig = config.bootConfig ?? {};
        this.loadingMessages = config.loadingMessages ?? [];
        this.currentWallpaper = config.currentWallpaper ?? null;
        
        // Use backend timing configuration with improved return visitor duration
        // Increased from 1200ms to 2500ms for better message readability
        this.duration = this.bootConfig.duration || (this.isFirstVisit ? 4500 : 2500);
        this.messages = this.getBootMessages();
        
        // Minimum message duration for readability (300ms per message)
        this.MIN_MESSAGE_DURATION = 300;
        
        // DOM elements
        this.container = config.container || document.querySelector('.boot-screen-container');
        this.progressFill = this.container?.querySelector('#progressFill');
        this.messageElement = this.container?.querySelector('#bootMessage');
        this.bootScreen = this.container?.querySelector('#bootScreen');
        this.wallpaperBackground = this.container?.querySelector('#wallpaperBackground');
        this.movingLightsBackground = this.container?.querySelector('#movingLightsBackground');
        this.profileImage = this.container?.querySelector('#profileImage');
        this.bootProgressSection = this.container?.querySelector('#bootProgressSection');
        this.bootCompleteSection = this.container?.querySelector('#bootCompleteSection');
        this.enterDesktopBtn = this.container?.querySelector('#enterDesktopBtn');
        
        // For embedded mode, get desktop container
        if (this.isEmbedded) {
            this.overlay = document.getElementById('boot-screen-overlay') || this.container;
            this.desktopContainer = document.getElementById('desktop');
        }
        
        console.log('Boot Screen Initialized:', {
            duration: this.duration,
            firstVisit: this.isFirstVisit,
            embedded: this.isEmbedded,
            messages: this.messages.length
        });
        
        this.init();
    }
    
    async init() {
        try {
            // Apply saved theme FIRST (before wallpaper loads)
            this.applySavedTheme();
            
            // Load wallpaper background
            await this.loadWallpaperBackground();
            
            // Skip boot if configured and return visitor
            if (this.bootConfig.skipBoot && !this.isFirstVisit) {
                this.completeBootImmediately();
                return;
            }
            
            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Start boot sequence
            this.startBootSequence();
            
        } catch (error) {
            console.error('Boot initialization error:', error);
            setTimeout(() => this.completeBootImmediately(), 1500);
        }
    }
    
    async loadWallpaperBackground() {
        try {
            let wallpaperUrl = '/images/wallpapers/14-Sonoma-Dark.jpg'; // Default
            
            // Priority 1: Check localStorage (user's saved preference)
            const savedWallpaper = localStorage.getItem('current_wallpaper');
            if (savedWallpaper) {
                try {
                    const wallpaper = JSON.parse(savedWallpaper);
                    wallpaperUrl = wallpaper.fullImage || wallpaper.url || wallpaperUrl;
                    console.log('✅ Using saved wallpaper from localStorage:', wallpaperUrl);
                    this.currentWallpaper = wallpaper;
                } catch (e) {
                    console.warn('⚠️ Invalid saved wallpaper data, falling back');
                }
            }
            
            // Priority 2: Use backend wallpaper (only if no saved preference)
            if (!savedWallpaper && this.currentWallpaper && this.currentWallpaper.fullImage) {
                wallpaperUrl = this.currentWallpaper.fullImage;
                console.log('📡 Using backend wallpaper:', wallpaperUrl);
            }
            
            // Priority 3: Time-based default (if no saved and no backend)
            if (!savedWallpaper && !this.currentWallpaper) {
                const hour = new Date().getHours();
                const isDaytime = hour >= 6 && hour < 18;
                wallpaperUrl = isDaytime 
                    ? '/images/wallpapers/14-Sonoma-Light.jpg'
                    : '/images/wallpapers/14-Sonoma-Dark.jpg';
                console.log('🕐 Using time-based default:', wallpaperUrl);
            }
            
            // Preload the wallpaper image
            const img = new Image();
            await new Promise((resolve) => {
                img.onload = () => {
                    console.log('Wallpaper preloaded successfully');
                    resolve();
                };
                img.onerror = () => {
                    console.warn('Failed to preload wallpaper, using default');
                    resolve();
                };
                img.src = wallpaperUrl;
            });
            
            // Apply the wallpaper with blur
            if (this.wallpaperBackground) {
                this.wallpaperBackground.style.backgroundImage = `url(${wallpaperUrl})`;
                
                // Fade in the wallpaper background
                setTimeout(() => {
                    this.wallpaperBackground.classList.add('loaded');
                    console.log('Wallpaper background applied and faded in');
                }, 100);
            }
            
        } catch (error) {
            console.error('Error loading wallpaper background:', error);
        }
    }
    
    /**
     * Apply saved theme from localStorage
     * Priority: localStorage > time-based auto > light (default)
     */
    applySavedTheme() {
        try {
            // Priority 1: Check localStorage for saved theme
            const savedTheme = localStorage.getItem('app_theme');
            let effectiveTheme = 'light'; // default
            
            if (savedTheme) {
                if (savedTheme === 'auto') {
                    // Auto theme - use time-based logic
                    const hour = new Date().getHours();
                    effectiveTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
                    console.log('🎨 Boot: Using auto theme →', effectiveTheme, '(based on time)');
                } else {
                    // Use saved theme directly
                    effectiveTheme = savedTheme;
                    console.log('✅ Boot: Using saved theme →', effectiveTheme);
                }
            } else {
                // Priority 2: Check system preference
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    effectiveTheme = 'dark';
                    console.log('🖥️ Boot: Using system preference → dark');
                } else {
                    console.log('☀️ Boot: Using default theme → light');
                }
            }
            
            // Apply theme to document
            document.documentElement.setAttribute('data-theme', effectiveTheme);
            console.log(`🎨 Boot screen theme applied: ${effectiveTheme}`);
            
            // Also apply to body for boot screen specific styles
            if (this.container) {
                this.container.setAttribute('data-theme', effectiveTheme);
            }
            
        } catch (error) {
            console.error('Error applying saved theme to boot screen:', error);
            // Fallback to light theme
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }
    
    getBootMessages() {
        // Get personal touches from loading messages data
        const personalTouches = this.loadingMessages?.personal_touches || [
            "Fun fact: I don't have any Apple device!",
            "Tip: Try right-clicking the desktop",
            "Easter egg: Type 'theme alien' in terminal",
            "Fact: LinkOS was inspired by macOS!",
            "Hint: Check out the games in the terminal"
        ];
        
        let messages = [];
        
        // Use backend messages if available
        if (this.loadingMessages && this.loadingMessages.boot_sequence) {
            // Combine messages from different boot stages
            messages = [
                'LinkOS',
                ...this.loadingMessages.boot_sequence.initial,
                ...this.loadingMessages.boot_sequence.components,
                ...this.loadingMessages.boot_sequence.wallpapers,
                ...this.loadingMessages.boot_sequence.finalizing
            ].filter(msg => msg.trim() !== ''); // Remove empty messages
        } else {
            // Default LinkOS messages
            messages = [
                'LinkOS',
                'Loading essential services...',
                'Initializing security framework...',
                'Starting system services...',
                'Loading user preferences...',
                'Preparing desktop environment...'
            ];
        }

        // Always add ONE random personal touch as the FINAL message
        const randomIndex = Math.floor(Math.random() * personalTouches.length);
        const finalPersonalTouch = personalTouches[randomIndex];
        messages.push(finalPersonalTouch);

        return messages;
    }
    
    setupKeyboardShortcuts() {
        this.keydownHandler = (e) => {
            // Escape or Space to skip boot
            if (e.key === 'Escape' || e.key === ' ') {
                e.preventDefault();
                this.completeBootImmediately();
                return;
            }
            
            // Cmd/Ctrl + R to restart
            if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
                e.preventDefault();
                if (this.isEmbedded) {
                    fetch('/api/desktop/reset-boot', { method: 'POST' })
                        .then(() => window.location.reload())
                        .catch(() => window.location.reload());
                } else {
                    sessionStorage.removeItem('portfolio_visited');
                    window.location.reload();
                }
                return;
            }
            
            // Cmd/Ctrl + V to skip boot (verbose mode off)
            if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
                e.preventDefault();
                this.completeBootImmediately();
                return;
            }
            
            // Prevent other keys during boot (authentic behavior)
            e.preventDefault();
        };
        
        document.addEventListener('keydown', this.keydownHandler);
    }
    
    startBootSequence() {
        // Start progress animation after profile and wallpaper appear
        setTimeout(() => this.animateProgress(), 2500);
        
        // Start message updates
        setTimeout(() => this.startMessageUpdates(), 3000);
        
        // Complete boot after duration
        setTimeout(() => this.completeBoot(), this.duration + 2500);
    }
    
    animateProgress() {
        const totalSteps = 100;
        const stepDuration = (this.duration - 500) / totalSteps;
        let progressStep = 0;
        
        const updateProgress = () => {
            progressStep++;
            const t = progressStep / totalSteps;
            
            // Authentic LinkOS progress curve
            let progress;
            if (t < 0.05) progress = t * 20;
            else if (t < 0.15) progress = 1 + (t - 0.05) * 100;
            else if (t < 0.35) progress = 2 + (t - 0.15) * 165;
            else if (t < 0.75) progress = 35 + (t - 0.35) * 100;
            else if (t < 0.95) progress = 75 + (t - 0.75) * 100;
            else progress = 95 + (t - 0.95) * 100;
            
            progress = Math.min(progress, 100);
            this.progress = progress;
            
            if (this.progressFill) {
                this.progressFill.style.width = `${progress}%`;
            }
            
            if (progressStep < totalSteps && progress < 100) {
                let delay = stepDuration;
                if (t < 0.15) delay *= 1.5; // Slower at start
                if (t > 0.85) delay *= 1.2; // Slower at end
                setTimeout(updateProgress, delay);
            }
        };
        
        updateProgress();
    }
    
    startMessageUpdates() {
        // Calculate message interval with minimum duration enforcement
        const idealInterval = this.duration / Math.max(this.messages.length, 1);
        const messageInterval = Math.max(idealInterval, this.MIN_MESSAGE_DURATION);
        
        // If messages need more time, extend boot duration
        const requiredDuration = messageInterval * this.messages.length;
        if (requiredDuration > this.duration) {
            console.log(`Extending boot duration from ${this.duration}ms to ${requiredDuration}ms for message readability`);
            this.duration = requiredDuration;
        }
        
        // Distribute messages evenly across the boot duration
        const messageTimings = [];
        for (let i = 0; i < this.messages.length; i++) {
            messageTimings.push({ delay: i * messageInterval });
        }
        
        // Show messages at calculated intervals
        messageTimings.forEach((timing, index) => {
            if (index < this.messages.length) {
                setTimeout(() => this.updateMessage(this.messages[index]), timing.delay);
            }
        });
        
        // Store last message for persistence after boot complete
        this.lastMessage = this.messages[this.messages.length - 1];
    }
    
    updateMessage(message) {
        if (!this.messageElement) return;
        
        this.messageElement.style.opacity = '0';
        this.messageElement.style.transform = 'translateY(5px)';
        
        setTimeout(() => {
            this.messageElement.textContent = message;
            this.messageElement.style.opacity = '0.7';
            this.messageElement.style.transform = 'translateY(0)';
        }, 300);
    }
    
    completeBoot() {
        // Ensure 100% progress
        if (this.progressFill) {
            this.progressFill.style.width = '100%';
        }
        
        // Mark session as visited
        sessionStorage.setItem('portfolio_visited', 'true');
        
        // Transition from moving lights to wallpaper
        this.transitionToWallpaper();
        
        // Wait a moment then show the Enter Desktop button
        setTimeout(() => {
            this.showEnterDesktopButton();
            
            // Persist the last message that was shown in boot complete section
            // Don't update the message display - just persist what's already there
            if (this.lastMessage) {
                this.addPersistentMessage(this.lastMessage);
            }
        }, 1500);
    }
    
    /**
     * Add persistent message to boot complete section
     */
    addPersistentMessage(message) {
        if (!this.bootCompleteSection || !message) return;
        
        // Check if message element already exists
        let messageDisplay = this.bootCompleteSection.querySelector('.boot-complete-message');
        
        if (!messageDisplay) {
            // Create new message element
            messageDisplay = document.createElement('p');
            messageDisplay.className = 'boot-complete-message';
            
            // Insert before button
            const button = this.bootCompleteSection.querySelector('#enterDesktopBtn');
            if (button) {
                this.bootCompleteSection.insertBefore(messageDisplay, button);
            } else {
                this.bootCompleteSection.appendChild(messageDisplay);
            }
        }
        
        // Update message text
        messageDisplay.textContent = message;
        messageDisplay.style.opacity = '0';
        messageDisplay.style.transform = 'translateY(-10px)';
        
        // Animate in
        setTimeout(() => {
            messageDisplay.style.opacity = '1';
            messageDisplay.style.transform = 'translateY(0)';
        }, 200);
    }
    
    /**
     * Smooth transition from moving lights to wallpaper
     */
    transitionToWallpaper() {
        if (this.movingLightsBackground && this.wallpaperBackground) {
            // Fade out moving lights
            this.movingLightsBackground.classList.add('fade-out');
            
            // Fade in wallpaper
            setTimeout(() => {
                this.wallpaperBackground.style.opacity = '1';
            }, 500);
        }
    }
    
    /**
     * Show the Enter Desktop button and hide progress bar
     */
    showEnterDesktopButton() {
        // Hide progress section
        if (this.bootProgressSection) {
            this.bootProgressSection.style.opacity = '0';
            this.bootProgressSection.style.transform = 'translateY(10px)';
            this.bootProgressSection.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                this.bootProgressSection.style.display = 'none';
            }, 400);
        }
        
        // Show complete section with button
        if (this.bootCompleteSection) {
            this.bootCompleteSection.style.display = 'block';
            setTimeout(() => {
                this.bootCompleteSection.classList.add('show');
            }, 100);
        }
        
        // Setup button click handler
        if (this.enterDesktopBtn) {
            this.enterDesktopBtn.addEventListener('click', () => {
                this.proceedToDesktop();
            });
            
            // Add keyboard support (Enter key)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && this.bootCompleteSection && this.bootCompleteSection.style.display === 'block') {
                    this.proceedToDesktop();
                }
            });
        }
    }
    
    /**
     * Proceed to desktop after button click
     */
    proceedToDesktop() {
        if (this.isEmbedded) {
            // Embedded mode - hide overlay and show desktop
            const target = this.overlay || this.container;
            if (target) {
                target.classList.add('boot-fade-out');
                
                setTimeout(() => {
                    target.style.display = 'none';
                    if (this.desktopContainer) {
                        this.desktopContainer.style.display = 'block';
                    }
                    this.cleanup();
                    window.dispatchEvent(new CustomEvent('boot-complete'));
                    console.log('Embedded boot sequence completed');
                }, 1200);
            }
        } else {
            // Standalone mode - redirect to desktop
            if (this.bootScreen) {
                this.bootScreen.classList.add('boot-fade-out');
                
                setTimeout(() => {
                    this.cleanup();
                    window.location.href = this.bootConfig.redirectUrl || '/desktop';
                }, 1200);
            }
        }
    }
    
    completeBootImmediately() {
        sessionStorage.setItem('portfolio_visited', 'true');
        
        if (this.isEmbedded) {
            // Embedded mode - hide overlay and show desktop immediately
            const target = this.overlay || this.container;
            if (target) {
                target.style.display = 'none';
            }
            if (this.desktopContainer) {
                this.desktopContainer.style.display = 'block';
            }
            this.cleanup();
            window.dispatchEvent(new CustomEvent('boot-complete'));
            console.log('Boot sequence skipped in embedded mode');
        } else {
            // Standalone mode - redirect
            this.cleanup();
            window.location.href = this.bootConfig.redirectUrl || '/';
        }
    }
    
    /**
     * Get a random personal touch message for boot completion
     */
    getRandomPersonalTouch() {
        // Get personal touches from loading messages data
        const personalTouches = this.loadingMessages?.personal_touches || [
            "Fun fact: I don't have any Apple device!",
            "Tip: Try right-clicking the desktop",
            "Easter egg: Type 'theme alien' in terminal",
            "Fact: LinkOS was inspired by macOS!",
            "Hint: Check out the games in the terminal"
        ];
        
        // Select random personal touch
        const randomIndex = Math.floor(Math.random() * personalTouches.length);
        return personalTouches[randomIndex];
    }
    
    cleanup() {
        // Remove event listeners
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }
    }
}

// Auto-initialize if configuration is available
document.addEventListener('DOMContentLoaded', function() {
    if (window.BootScreenConfig) {
        new LinkOSBootScreen(window.BootScreenConfig);
    }
});

// Export for manual initialization
window.LinkOSBootScreen = LinkOSBootScreen;