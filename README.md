# AICHI3LM11.29 / OmniCore Wallet

企业级多链智能钱包平台 / Enterprise Multi-Chain Smart Wallet Platform

## 快速推送 / Quick Push

提供了三个脚本用于简化 Git 推送操作：

**Windows (PowerShell):**
```powershell
.\push.ps1 "提交消息"           # 基本推送
.\push.ps1 "消息" -Force        # 强制推送
.\push.ps1 "消息" -LargeFile    # 大文件模式
```

**Windows (命令提示符):**
```batch
push.bat "提交消息"             # 基本推送
push.bat "消息" /f              # 强制推送
push.bat "消息" /l              # 大文件模式
```

**Linux/macOS:**
```bash
./push.sh "提交消息"            # 基本推送
./push.sh "消息" -f             # 强制推送
./push.sh "消息" -l             # 大文件模式
```

### 大文件上传问题 / Large File Upload Issues

如果遇到上传超时，尝试：
```bash
git config http.postBuffer 524288000
```

或使用大文件模式：`-LargeFile` / `-l`

---

# Taxido v2.0