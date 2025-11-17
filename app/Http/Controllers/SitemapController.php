<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use App\Services\PortfolioService;

/**
 * SitemapController - Generate XML sitemap for SEO
 * Provides search engines with a complete map of site content
 */
class SitemapController extends Controller
{
    protected $portfolioService;

    public function __construct(PortfolioService $portfolioService)
    {
        $this->portfolioService = $portfolioService;
    }

    /**
     * Generate and return XML sitemap
     */
    public function index()
    {
        try {
            // Get portfolio projects for dynamic URLs
            $portfolioData = $this->portfolioService->getAllProjects();
            $projects = $portfolioData['projects'] ?? [];
            
            // Build sitemap URLs
            $urls = $this->buildSitemapUrls($projects);
            
            // Generate XML
            $xml = $this->generateSitemapXml($urls);
            
            // Return XML response with proper headers
            return response($xml, 200)
                ->header('Content-Type', 'application/xml')
                ->header('Cache-Control', 'public, max-age=3600');
                
        } catch (\Exception $e) {
            Log::error('Failed to generate sitemap: ' . $e->getMessage());
            
            // Return basic sitemap on error
            $basicUrls = $this->buildBasicSitemapUrls();
            $xml = $this->generateSitemapXml($basicUrls);
            
            return response($xml, 200)
                ->header('Content-Type', 'application/xml');
        }
    }

    /**
     * Build sitemap URLs array
     */
    private function buildSitemapUrls(array $projects): array
    {
        $baseUrl = config('app.url');
        $urls = [];
        
        // Homepage (Desktop)
        $urls[] = [
            'loc' => $baseUrl,
            'lastmod' => now()->toW3cString(),
            'changefreq' => 'weekly',
            'priority' => '1.0'
        ];
        
        // Portfolio projects (if available via API)
        foreach ($projects as $project) {
            if (isset($project['slug'])) {
                $urls[] = [
                    'loc' => "{$baseUrl}/project/{$project['slug']}",
                    'lastmod' => $project['lastUpdated'] ?? now()->toW3cString(),
                    'changefreq' => 'monthly',
                    'priority' => '0.8'
                ];
            }
        }
        
        // About page (if exists)
        $urls[] = [
            'loc' => "{$baseUrl}/about",
            'lastmod' => now()->toW3cString(),
            'changefreq' => 'monthly',
            'priority' => '0.7'
        ];
        
        return $urls;
    }

    /**
     * Build basic sitemap URLs (fallback)
     */
    private function buildBasicSitemapUrls(): array
    {
        $baseUrl = config('app.url');
        
        return [
            [
                'loc' => $baseUrl,
                'lastmod' => now()->toW3cString(),
                'changefreq' => 'weekly',
                'priority' => '1.0'
            ]
        ];
    }

    /**
     * Generate XML sitemap from URLs array
     */
    private function generateSitemapXml(array $urls): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;
        
        foreach ($urls as $url) {
            $xml .= '  <url>' . PHP_EOL;
            $xml .= '    <loc>' . htmlspecialchars($url['loc']) . '</loc>' . PHP_EOL;
            
            if (isset($url['lastmod'])) {
                $xml .= '    <lastmod>' . $url['lastmod'] . '</lastmod>' . PHP_EOL;
            }
            
            if (isset($url['changefreq'])) {
                $xml .= '    <changefreq>' . $url['changefreq'] . '</changefreq>' . PHP_EOL;
            }
            
            if (isset($url['priority'])) {
                $xml .= '    <priority>' . $url['priority'] . '</priority>' . PHP_EOL;
            }
            
            $xml .= '  </url>' . PHP_EOL;
        }
        
        $xml .= '</urlset>';
        
        return $xml;
    }
}
