rm audio-biz.zip
cd src
7za a -mm=Deflate -mfb=258 -mpass=15 -r ../audio-biz.zip *
cd .. 
aws lambda update-function-code --function-name audio-biz-v2 --zip-file fileb://audio-biz.zip
