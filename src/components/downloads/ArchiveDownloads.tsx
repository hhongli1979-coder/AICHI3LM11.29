import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DownloadSimple,
  FileArchive,
  FileZip,
  Package,
  Code,
} from '@phosphor-icons/react';

interface ArchiveFile {
  id: string;
  name: string;
  url: string;
  type: 'core' | 'minimal' | 'source';
  format: 'tar.gz' | 'zip';
  description: string;
  size?: string;
}

// Configuration constants for AICHI3LM archives
const ARCHIVE_VERSION = '20251129';
const ARCHIVE_BASE_URL = 'http://127.0.0.1:8080';

const ARCHIVE_FILES: ArchiveFile[] = [
  {
    id: 'core-tar',
    name: `AICHI3LM-core-${ARCHIVE_VERSION}.tar.gz`,
    url: `${ARCHIVE_BASE_URL}/AICHI3LM-core-${ARCHIVE_VERSION}.tar.gz`,
    type: 'core',
    format: 'tar.gz',
    description: '核心包 - 包含完整的AICHI3LM核心组件',
    size: '~150 MB',
  },
  {
    id: 'minimal-zip',
    name: `AICHI3LM-minimal-${ARCHIVE_VERSION}.zip`,
    url: `${ARCHIVE_BASE_URL}/AICHI3LM-minimal-${ARCHIVE_VERSION}.zip`,
    type: 'minimal',
    format: 'zip',
    description: '精简包 - 包含基础功能组件 (ZIP格式)',
    size: '~50 MB',
  },
  {
    id: 'minimal-tar',
    name: `AICHI3LM-minimal-${ARCHIVE_VERSION}.tar.gz`,
    url: `${ARCHIVE_BASE_URL}/AICHI3LM-minimal-${ARCHIVE_VERSION}.tar.gz`,
    type: 'minimal',
    format: 'tar.gz',
    description: '精简包 - 包含基础功能组件 (TAR.GZ格式)',
    size: '~48 MB',
  },
  {
    id: 'source-tar',
    name: `AICHI3LM-source-${ARCHIVE_VERSION}.tar.gz`,
    url: `${ARCHIVE_BASE_URL}/AICHI3LM-source-${ARCHIVE_VERSION}.tar.gz`,
    type: 'source',
    format: 'tar.gz',
    description: '源码包 - 包含完整源代码和开发工具',
    size: '~200 MB',
  },
];

function getTypeIcon(type: ArchiveFile['type']) {
  switch (type) {
    case 'core':
      return <Package size={20} weight="duotone" className="text-primary" />;
    case 'minimal':
      return <FileArchive size={20} weight="duotone" className="text-green-600" />;
    case 'source':
      return <Code size={20} weight="duotone" className="text-purple-600" />;
    default:
      return <FileArchive size={20} weight="duotone" />;
  }
}

function getTypeBadgeColor(type: ArchiveFile['type']) {
  switch (type) {
    case 'core':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'minimal':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'source':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

function getTypeLabel(type: ArchiveFile['type']) {
  switch (type) {
    case 'core':
      return '核心包';
    case 'minimal':
      return '精简包';
    case 'source':
      return '源码包';
    default:
      return type;
  }
}

function getFormatIcon(format: ArchiveFile['format']) {
  switch (format) {
    case 'zip':
      return <FileZip size={16} weight="duotone" className="text-amber-600" />;
    case 'tar.gz':
      return <FileArchive size={16} weight="duotone" className="text-orange-600" />;
    default:
      return <FileArchive size={16} weight="duotone" />;
  }
}

interface ArchiveCardProps {
  archive: ArchiveFile;
}

function isValidDownloadUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    // Only allow http/https protocols and ensure URL starts with expected base
    return (
      (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') &&
      url.startsWith(ARCHIVE_BASE_URL)
    );
  } catch {
    return false;
  }
}

function ArchiveCard({ archive }: ArchiveCardProps) {
  const handleDownload = () => {
    if (isValidDownloadUrl(archive.url)) {
      window.open(archive.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-muted">
              {getTypeIcon(archive.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="outline" className={`text-xs ${getTypeBadgeColor(archive.type)}`}>
                  {getTypeLabel(archive.type)}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getFormatIcon(archive.format)}
                  <span>{archive.format.toUpperCase()}</span>
                </div>
                {archive.size && (
                  <span className="text-xs text-muted-foreground">
                    {archive.size}
                  </span>
                )}
              </div>
              <div className="font-medium text-sm truncate" title={archive.name}>
                {archive.name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {archive.description}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1 ml-2 shrink-0"
            onClick={handleDownload}
          >
            <DownloadSimple size={16} weight="bold" />
            下载
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ArchiveDownloads() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
            <FileArchive size={32} weight="duotone" className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">AICHI3LM 下载</h2>
            <p className="text-muted-foreground">
              兜底方案 - 选择适合您需求的安装包
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1">
          版本: {ARCHIVE_VERSION}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package size={20} weight="duotone" />
            可用下载
          </CardTitle>
          <CardDescription>
            选择您需要的AICHI3LM安装包版本进行下载
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {ARCHIVE_FILES.map((archive) => (
              <ArchiveCard key={archive.id} archive={archive} />
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileArchive size={16} weight="fill" className="text-amber-500" />
              <span className="font-medium text-sm">安装说明</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>核心包</strong>: 适合需要完整功能的生产环境部署</li>
              <li>• <strong>精简包</strong>: 适合快速测试和开发环境</li>
              <li>• <strong>源码包</strong>: 适合需要自定义修改的开发者</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
