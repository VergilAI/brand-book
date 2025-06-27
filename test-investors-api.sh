#!/bin/bash

echo "Testing Investors API endpoints..."
echo ""

echo "1. Testing /api/investors/balances"
curl -s http://localhost:3000/api/investors/balances | jq . || echo "Failed to fetch balances"
echo ""

echo "2. Testing /api/investors/dashboard"
curl -s http://localhost:3000/api/investors/dashboard | jq . || echo "Failed to fetch dashboard"
echo ""

echo "3. Testing /investors page"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/investors
echo ""

echo "4. Testing /investors/admin page"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/investors/admin
echo ""