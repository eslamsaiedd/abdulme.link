<?php

return [

    /*
    |--------------------------------------------------------------------------
    | SEO Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains all SEO-related configuration for the portfolio.
    | All values are customizable via environment variables.
    |
    */

    // Personal Information
    'name' => env('SEO_NAME', 'Abdulmelik Saylan'),
    'alternate_name' => env('SEO_ALTERNATE_NAME', 'AbdulmeLink'),
    'profile_image' => env('SEO_PROFILE_IMAGE', 'images/abdulmelik_saylan.jpg'),
    'job_title' => env('SEO_JOB_TITLE', 'Software Engineer'),
    'bio' => env('SEO_BIO', 'Software engineer specializing in modern web applications and creating innovative user experiences.'),
    'location' => env('SEO_LOCATION', 'Istanbul, Turkey'),
    'email' => env('SEO_EMAIL', 'abdulmeliksaylan@gmail.com'),
    
    // Site Information
    'site_name' => env('SEO_SITE_NAME', 'Abdulmelik Saylan Portfolio'),
    'site_tagline' => env('SEO_SITE_TAGLINE', 'Interactive macOS Portfolio Experience'),
    'site_domain' => env('SEO_SITE_DOMAIN', 'abdulme.link'),
    'footer_text' => env('SEO_FOOTER_TEXT', 'Built with passion and attention to detail'),
    
    // Meta Tags
    'meta' => [
        'title' => env('SEO_META_TITLE', 'Abdulmelik Saylan - Software Engineer | Interactive macOS Portfolio Experience'),
        'description' => env('SEO_META_DESCRIPTION', 'Experience an immersive macOS-style portfolio by Abdulmelik Saylan. Software engineer creating modern web applications with interactive terminal, authentic animations, and 60fps performance. Explore projects, skills, and get in touch.'),
        'keywords' => env('SEO_META_KEYWORDS', 'software engineer, web developer, portfolio, web applications, modern web design, interactive portfolio, Abdulmelik Saylan, Turkey developer, Istanbul developer, terminal emulator, xterm.js, progressive web app'),
        'author' => env('SEO_META_AUTHOR', 'Abdulmelik Saylan'),
    ],
    
    // Open Graph
    'og' => [
        'type' => env('SEO_OG_TYPE', 'website'),
        'image' => env('SEO_OG_IMAGE', '/images/og-image.jpg'),
        'image_width' => env('SEO_OG_IMAGE_WIDTH', '1200'),
        'image_height' => env('SEO_OG_IMAGE_HEIGHT', '630'),
        'locale' => env('SEO_OG_LOCALE', 'en_US'),
    ],
    
    // Twitter Card
    'twitter' => [
        'card' => env('SEO_TWITTER_CARD', 'summary_large_image'),
        'site' => env('SEO_TWITTER_SITE', '@abdulmelink'),
        'creator' => env('SEO_TWITTER_CREATOR', '@abdulmelink'),
    ],
    
    // Social Media Links
    'social' => [
        'github' => env('SEO_SOCIAL_GITHUB', 'https://github.com/abdulmelink'),
        'linkedin' => env('SEO_SOCIAL_LINKEDIN', 'https://linkedin.com/in/abdulmelink'),
        'twitter' => env('SEO_SOCIAL_TWITTER', 'https://twitter.com/abdulmelink'),
    ],
    
    // Skills/Technologies (for structured data)
    'skills' => explode(',', env('SEO_SKILLS', 'Web Development,Software Engineering,Modern Web Applications,RESTful APIs,Frontend Development,Backend Development,Database Design,System Architecture')),
    
    // Structured Data
    'structured_data' => [
        'enable_person' => env('SEO_STRUCTURED_PERSON', true),
        'enable_website' => env('SEO_STRUCTURED_WEBSITE', true),
        'enable_breadcrumbs' => env('SEO_STRUCTURED_BREADCRUMBS', true),
    ],
    
    // Robots & Crawling
    'robots' => [
        'index' => env('SEO_ROBOTS_INDEX', true),
        'follow' => env('SEO_ROBOTS_FOLLOW', true),
        'max_snippet' => env('SEO_ROBOTS_MAX_SNIPPET', -1),
        'max_image_preview' => env('SEO_ROBOTS_MAX_IMAGE_PREVIEW', 'large'),
        'max_video_preview' => env('SEO_ROBOTS_MAX_VIDEO_PREVIEW', -1),
    ],
    
    // Sitemap
    'sitemap' => [
        'enable' => env('SEO_SITEMAP_ENABLE', true),
        'homepage_priority' => env('SEO_SITEMAP_HOME_PRIORITY', '1.0'),
        'homepage_changefreq' => env('SEO_SITEMAP_HOME_CHANGEFREQ', 'weekly'),
        'projects_priority' => env('SEO_SITEMAP_PROJECTS_PRIORITY', '0.8'),
        'projects_changefreq' => env('SEO_SITEMAP_PROJECTS_CHANGEFREQ', 'monthly'),
    ],

];
