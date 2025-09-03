import { Router } from 'express';
import { createPWAAPK } from '../utils/apkGenerator';

const router = Router();

router.post('/generate-apk', async (req, res) => {
  try {
    const { appName, packageName, version, manifestUrl, startUrl, iconUrl } = req.body;

    // Validate required fields
    if (!appName || !packageName || !version || !startUrl) {
      return res.status(400).json({ 
        error: 'Missing required fields: appName, packageName, version, startUrl' 
      });
    }

    console.log('Generating APK for:', { appName, packageName, version });

    // Generate APK
    const apkBuffer = await createPWAAPK({
      appName,
      packageName,
      version,
      manifestUrl,
      startUrl,
      iconUrl
    });

    // Set headers for APK download
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', `attachment; filename="${appName}-v${version}.apk"`);
    res.setHeader('Content-Length', apkBuffer.length);

    // Send APK file
    res.send(apkBuffer);

  } catch (error) {
    console.error('Error generating APK:', error);
    res.status(500).json({ 
      error: 'Failed to generate APK',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as apkRouter };