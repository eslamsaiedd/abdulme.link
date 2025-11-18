@if(!isset($embedded) || !$embedded)
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>LinkOS</title>
    
    <!-- Boot Screen CSS -->
    <link rel="stylesheet" href="{{ asset('css/boot-screen.css') }}">
</head>
<body class="boot-screen-standalone">
@endif

<!-- Boot Screen Container -->
<div class="boot-screen-container">
    <!-- Moving lights background (fades to wallpaper) -->
    <div class="moving-lights-background" id="movingLightsBackground">
        <div class="light-orb orb-1"></div>
        <div class="light-orb orb-2"></div>
        <div class="light-orb orb-3"></div>
        <div class="light-orb orb-4"></div>
        <div class="light-orb orb-5"></div>
    </div>
    
    <!-- Blurred wallpaper background (hidden initially) -->
    <div class="wallpaper-background" id="wallpaperBackground" style="opacity: 0;"></div>
    
    <div class="boot-screen" id="bootScreen">
        <div class="boot-content-container">
            <!-- Profile photo section -->
            <div class="profile-section">
                <div class="profile-image-container">
                    <img src="{{ $profileImageUrl ?? asset(config('seo.profile_image')) }}" 
                         alt="{{ config('seo.name') }}" 
                         class="profile-image" 
                         id="profileImage" 
                         onerror="this.onerror=null; this.src='{{ asset('images/profile.jpg') }}';">
                    <div class="profile-glow"></div>
                </div>
                                            <!-- Social Links under profile -->
                <div class="profile-social-links">
                    @if(config('seo.social.github'))
                    <a href="{{ config('seo.social.github') }}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="social-link"
                       title="GitHub Profile"
                       aria-label="Visit GitHub profile">
                        <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.840 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.430.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>GitHub</span>
                    </a>
                    @endif
                    
                    @if(config('seo.social.linkedin'))
                    <a href="{{ config('seo.social.linkedin') }}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="social-link"
                       title="LinkedIn Profile"
                       aria-label="Connect on LinkedIn">
                        <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <span>LinkedIn</span>
                    </a>
                    @endif
                </div>

            </div>

            <!-- Stats section (shows during boot) -->
            <div class="boot-stats-section" id="bootStats">
                <div class="stat-card-mini">
                    <div class="stat-value-mini">{{ $stats['years_experience'] ?? '6' }}+</div>
                    <div class="stat-label-mini">Years Exp</div>
                </div>
                <div class="stat-card-mini">
                    <div class="stat-value-mini">{{ $stats['projects_completed'] ?? '8' }}+</div>
                    <div class="stat-label-mini">Projects</div>
                </div>
                <div class="stat-card-mini">
                    <div class="stat-value-mini">{{ $stats['technologies'] ?? '20' }}+</div>
                    <div class="stat-label-mini">Tech Stack</div>
                </div>
            </div>
            
            <!-- Boot progress section -->
            <div class="boot-progress-section" id="bootProgressSection">
                <div class="boot-progress-bar" id="bootProgressBar">
                    <div class="boot-progress-fill" id="progressFill"></div>
                </div>
                
                <div class="boot-message" id="bootMessage">LinkOS</div>
            </div>
            
            <!-- Enter Desktop Button (hidden initially, shows after boot) -->
            <div class="boot-complete-section" id="bootCompleteSection" style="display: none;">
                <!-- Enter Desktop Button -->
                <button class="enter-desktop-btn" id="enterDesktopBtn">
                    <span class="btn-text">Enter Desktop</span>
                    <span class="btn-icon">→</span>
                </button>
                <p class="boot-complete-hint">Press Enter or click to continue</p>
            </div>
            
            <!-- Simple Open Source Footer -->
            <div class="boot-footer-simple">
                <a href="https://github.com/abdulmeLINK/abdulme.link" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="open-source-link">
                    abdulme.link © {{ date('Y') }} - MIT Open Source
                </a>
            </div>
        </div>
    </div>
</div>

@if(!isset($embedded) || !$embedded)
<!-- Boot Screen JavaScript for standalone mode -->
<script src="{{ asset('js/components/BootScreen.js') }}"></script>
<script>
    // Configuration for standalone mode
    window.BootScreenConfig = {
        embedded: false,
        isFirstVisit: {{ json_encode($isFirstVisit ?? true) }},
        bootConfig: @json($bootConfig ?? []),
        loadingMessages: @json($loadingMessages ?? []),
        currentWallpaper: @json($currentWallpaper ?? null),
        container: document.querySelector('.boot-screen-container')
    };
</script>
</body>
</html>
@else
<!-- Embedded mode - JavaScript will be loaded by parent page -->
<script>
    // Configuration for embedded mode
    console.log('🔍 Boot screen embedded mode initializing...');
    console.log('🔍 LinkOSBootScreen available:', typeof LinkOSBootScreen);
    console.log('🔍 DOM readyState:', document.readyState);
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔍 DOMContentLoaded fired');
        console.log('🔍 LinkOSBootScreen available NOW:', typeof LinkOSBootScreen);
        console.log('🔍 window.AbdulmeApp:', typeof window.AbdulmeApp);
        
        if (typeof LinkOSBootScreen !== 'undefined') {
            console.log('✅ Starting LinkOSBootScreen');
            new LinkOSBootScreen({
                embedded: true,
                isFirstVisit: {{ json_encode($isFirstVisit ?? true) }},
                bootConfig: @json($bootConfig ?? []),
                loadingMessages: @json($loadingMessages ?? []),
                currentWallpaper: @json($currentWallpaper ?? null),
                container: document.querySelector('.boot-screen-container')
            });
        } else {
            console.error('❌ LinkOSBootScreen class not loaded');
            console.error('Available on window:', Object.keys(window).filter(k => k.includes('Boot') || k.includes('App')));
        }
    });
</script>
@endif