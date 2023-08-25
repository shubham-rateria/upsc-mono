#! /bin/zsh

aws s3 sync ./dist s3://usn-beta --profile wyre   
aws cloudfront create-invalidation --distribution-id E35TJZ5SJGMR8V --paths "/*" --profile wyre