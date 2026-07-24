# WordPress Plugin Packaging Guide
## CodeMonkey Document Repository

### 📦 Plugin Structure
Your plugin directory should contain these files:
```
document-repo/
├── admin.js
├── block.js
├── document-repo.php (main plugin file)
├── frontend.js
├── index.php (security)
├── readme.txt (WordPress standard)
├── README.md (GitHub/development)
├── style.css
├── uninstall.php
└── languages/ (optional - for translations)
```

### 🎯 How to Package for Distribution

#### Method 1: Manual ZIP Creation
1. **Navigate to your plugins directory:**
   ```
   c:\Users\simon\Local Sites\document-repo\app\public\wp-content\plugins\
   ```

2. **Select the `document-repo` folder**

3. **Create ZIP file:**
   - Right-click the folder → "Send to" → "Compressed (zipped) folder"
   - OR use 7-Zip/WinRAR: Right-click → "Add to archive"
   - Name it: `codemonkey-document-repository.zip`

#### Method 2: PowerShell Command
```powershell
# Navigate to plugins directory
cd "c:\Users\simon\Local Sites\document-repo\app\public\wp-content\plugins\"

# Create ZIP file
Compress-Archive -Path "document-repo" -DestinationPath "codemonkey-document-repository.zip"
```

### 📋 Pre-Package Checklist

Before creating your ZIP file, ensure:

- [ ] **Plugin header** is complete with all metadata
- [ ] **Version number** is updated in both `document-repo.php` and `readme.txt`
- [ ] **All files** are present and functional
- [ ] **No test files** are included (remove `icon-test.html`, `test.html` if not needed)
- [ ] **No development files** (.git, .DS_Store, Thumbs.db, etc.)
- [ ] **Security files** are present (`index.php`, `uninstall.php`)

### 🚀 Installation Methods

#### For Your Own Sites:
1. **WordPress Admin Upload:**
   - Go to Plugins → Add New → Upload Plugin
   - Choose your ZIP file
   - Click "Install Now" → "Activate"

2. **FTP/Manual Upload:**
   - Extract ZIP file
   - Upload `document-repo` folder to `/wp-content/plugins/`
   - Activate in WordPress admin

3. **Local Development:**
   - Copy folder to `/wp-content/plugins/`
   - Activate in WordPress admin

#### For Distribution:
1. **WordPress Plugin Directory** (if approved)
2. **GitHub Releases**
3. **Your own website downloads**
4. **Premium marketplaces**

### 🔧 Version Management

When updating your plugin:

1. **Update version number** in:
   - `document-repo.php` header
   - `readme.txt` stable tag
   - `DOCUMENT_REPO_VERSION` constant

2. **Update changelog** in `readme.txt`

3. **Test thoroughly** before packaging

4. **Create new ZIP** with updated version name

### 📝 Distribution Tips

#### File Naming Convention:
- Development: `document-repo-v0.5.0.zip`
- Production: `codemonkey-document-repository.zip`
- Versioned: `codemonkey-document-repository-0.5.0.zip`

#### What to Include:
✅ Core plugin files
✅ readme.txt (WordPress standard)
✅ Security files (index.php, uninstall.php)
✅ Assets (CSS, JS)

#### What to Exclude:
❌ Development files (.git, .gitignore)
❌ Test files (unless needed)
❌ IDE files (.vscode, .idea)
❌ System files (.DS_Store, Thumbs.db)
❌ Backup files (~, .bak)

### 🛡️ Security Considerations

Your plugin includes:
- **Direct access prevention** (`if ( ! defined( 'ABSPATH' ) ) exit;`)
- **Input sanitization** (`sanitize_text_field`, `esc_attr`, `esc_url`)
- **Proper nonces** for form submissions
- **Capability checks** for admin functions
- **Clean uninstall** process

### 🎉 Ready to Install!

Your plugin is now properly packaged and ready for installation on any WordPress site. The ZIP file contains everything needed for a professional WordPress plugin installation.