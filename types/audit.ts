// types/audit.ts

// Page Status
export interface PageStatus {
    status: number;
    statusText: string;
}

// Open Graph
export interface OG{
    title?: string;
    description?: string;
    image?: string;
}

// Twitter
export interface Twitter{
    title?: string;
    description?: string;
    image?: string;
}

// Meta
export interface Meta {
    title?: string;
    description?: string;
    canonical?: string;
    favicon?: string;
    og: OG;
    twitter: Twitter
}

export interface Warning{
    message:string;
    severity: 'error' | 'warning' | 'info';
}

// Top Level Audit Result
export interface AuditResult {
    id: string;
    url: string;
    pageStatus: PageStatus;
    auditedAt: string;
    cached: boolean;
    warnings: Warning[];
    meta: Meta
}