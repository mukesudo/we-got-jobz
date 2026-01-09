# Kubernetes Deployment Guide

## Prerequisites

- Kubernetes 1.24+
- Helm 3.0+
- kubectl configured with cluster access
- Persistent Volume provisioner (AWS EBS, Azure Disk, etc.)

## Installation with Helm

### 1. Add Helm Repository

```bash
helm repo add freelance https://your-helm-repo.com
helm repo update
```

### 2. Create Namespace

```bash
kubectl create namespace production
```

### 3. Create Secrets

```bash
kubectl create secret generic app-secrets \
  --from-literal=database-url='postgresql://user:password@postgres:5432/marketplace' \
  --from-literal=redis-url='redis://redis:6379' \
  --from-literal=jwt-secret='your-jwt-secret' \
  --from-literal=stripe-secret='sk_test_...' \
  -n production
```

### 4. Install Helm Chart

```bash
helm install freelance-marketplace freelance/marketplace \
  --namespace production \
  --create-namespace \
  --values kubernetes/helm/values.yaml
```

### 5. Verify Installation

```bash
kubectl get pods -n production
kubectl get svc -n production
kubectl get ingress -n production
```

## Manual Deployment with kubectl

### 1. Apply Infrastructure

```bash
kubectl apply -f kubernetes/manifests/infrastructure.yaml
```

### 2. Apply Backend and Frontend

```bash
kubectl apply -f kubernetes/manifests/backend-deployment.yaml
kubectl apply -f kubernetes/manifests/frontend-deployment.yaml
```

### 3. Apply Ingress

```bash
# Install NGINX Ingress Controller first
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace

# Install cert-manager for SSL
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true

# Apply Ingress
kubectl apply -f kubernetes/manifests/ingress.yaml
```

## Scaling

### Horizontal Scaling

The HPA (HorizontalPodAutoscaler) is automatically configured. Monitor with:

```bash
kubectl get hpa -n production
watch kubectl get hpa -n production
```

### Manual Scaling

```bash
kubectl scale deployment backend --replicas=5 -n production
kubectl scale deployment frontend --replicas=5 -n production
```

## Monitoring & Observability

### Access Grafana

```bash
kubectl port-forward svc/grafana 3000:3000 -n production
# Open http://localhost:3000
# Default credentials: admin/admin
```

### Access Prometheus

```bash
kubectl port-forward svc/prometheus 9090:9090 -n production
# Open http://localhost:9090
```

### View Logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n production

# Frontend logs
kubectl logs -f deployment/frontend -n production

# All logs from namespace
kubectl logs -f -n production --all-containers=true
```

## Backup & Recovery

### Database Backup

```bash
kubectl exec -it postgres-0 -n production -- pg_dump -U postgres marketplace > backup.sql
```

### Restore from Backup

```bash
kubectl exec -it postgres-0 -n production -- psql -U postgres < backup.sql
```

## Troubleshooting

### Check Pod Status

```bash
kubectl describe pod <pod-name> -n production
```

### Check Events

```bash
kubectl get events -n production --sort-by='.lastTimestamp'
```

### Port Forward for Debugging

```bash
kubectl port-forward pod/<pod-name> 3000:3000 -n production
```

### Restart Deployment

```bash
kubectl rollout restart deployment/backend -n production
kubectl rollout restart deployment/frontend -n production
```

## Cleanup

### Delete Helm Release

```bash
helm uninstall freelance-marketplace -n production
```

### Delete Namespace

```bash
kubectl delete namespace production
```

## Production Checklist

- [ ] SSL/TLS certificates configured
- [ ] Database backups configured
- [ ] Monitoring and alerting enabled
- [ ] Resource quotas set
- [ ] Network policies configured
- [ ] RBAC roles configured
- [ ] Log aggregation enabled
- [ ] Pod security policies enforced
- [ ] High availability configured
- [ ] Disaster recovery plan documented
