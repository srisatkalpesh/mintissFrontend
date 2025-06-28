<template>
    <div class="container-fluid p-4">
        <div class="row">
            <div class="col-12">
                <h2 class="mb-4">Analytics</h2>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-3 mb-4">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-title">Total Sales</h6>
                                <h3 class="mb-0">${{ analytics.totalSales }}</h3>
                                <small>{{ analytics.salesGrowth }}% from last month</small>
                            </div>
                            <div class="align-self-center">
                                <i class="bi bi-currency-dollar fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3 mb-4">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-title">Orders</h6>
                                <h3 class="mb-0">{{ analytics.totalOrders }}</h3>
                                <small>{{ analytics.ordersGrowth }}% from last month</small>
                            </div>
                            <div class="align-self-center">
                                <i class="bi bi-cart fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3 mb-4">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-title">Products Sold</h6>
                                <h3 class="mb-0">{{ analytics.productsSold }}</h3>
                                <small>{{ analytics.productsGrowth }}% from last month</small>
                            </div>
                            <div class="align-self-center">
                                <i class="bi bi-box fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3 mb-4">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="card-title">Conversion Rate</h6>
                                <h3 class="mb-0">{{ analytics.conversionRate }}%</h3>
                                <small>{{ analytics.conversionGrowth }}% from last month</small>
                            </div>
                            <div class="align-self-center">
                                <i class="bi bi-graph-up fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-8 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Sales Overview</h5>
                    </div>
                    <div class="card-body">
                        <div class="text-center text-muted py-5">
                            <i class="bi bi-graph-up fs-1"></i>
                            <p>Sales chart will be displayed here</p>
                            <small>Chart integration would go here</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Top Categories</h5>
                    </div>
                    <div class="card-body">
                        <div v-for="category in analytics.topCategories" :key="category.name" class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <strong>{{ category.name }}</strong>
                                <br>
                                <small class="text-muted">{{ category.sales }} sales</small>
                            </div>
                            <div class="text-end">
                                <strong>${{ category.revenue }}</strong>
                                <br>
                                <small class="text-muted">{{ category.percentage }}%</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Recent Activity</h5>
                    </div>
                    <div class="card-body">
                        <div v-for="activity in analytics.recentActivity" :key="activity.id" class="d-flex align-items-start mb-3">
                            <div class="flex-shrink-0">
                                <i :class="getActivityIcon(activity.type)" class="text-primary"></i>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <p class="mb-1">{{ activity.description }}</p>
                                <small class="text-muted">{{ formatDate(activity.timestamp) }}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Performance Metrics</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6 mb-3">
                                <div class="text-center">
                                    <h4 class="text-primary">{{ analytics.avgOrderValue }}</h4>
                                    <small class="text-muted">Avg Order Value</small>
                                </div>
                            </div>
                            <div class="col-6 mb-3">
                                <div class="text-center">
                                    <h4 class="text-success">{{ analytics.customerSatisfaction }}%</h4>
                                    <small class="text-muted">Customer Satisfaction</small>
                                </div>
                            </div>
                            <div class="col-6 mb-3">
                                <div class="text-center">
                                    <h4 class="text-warning">{{ analytics.returnRate }}%</h4>
                                    <small class="text-muted">Return Rate</small>
                                </div>
                            </div>
                            <div class="col-6 mb-3">
                                <div class="text-center">
                                    <h4 class="text-info">{{ analytics.repeatCustomers }}%</h4>
                                    <small class="text-muted">Repeat Customers</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SellerAnalytics',
    data() {
        return {
            analytics: {
                totalSales: 0,
                salesGrowth: 0,
                totalOrders: 0,
                ordersGrowth: 0,
                productsSold: 0,
                productsGrowth: 0,
                conversionRate: 0,
                conversionGrowth: 0,
                topCategories: [],
                recentActivity: [],
                avgOrderValue: 0,
                customerSatisfaction: 0,
                returnRate: 0,
                repeatCustomers: 0
            }
        }
    },
    mounted() {
        this.loadAnalytics();
    },
    methods: {
        async loadAnalytics() {
            try {
                // TODO: Replace with actual API call
                this.analytics = {
                    totalSales: 1250.50,
                    salesGrowth: 15.5,
                    totalOrders: 45,
                    ordersGrowth: 8.2,
                    productsSold: 67,
                    productsGrowth: 12.3,
                    conversionRate: 3.2,
                    conversionGrowth: 1.1,
                    topCategories: [
                        { name: 'Electronics', sales: 25, revenue: 750.00, percentage: 60 },
                        { name: 'Clothing', sales: 18, revenue: 350.00, percentage: 28 },
                        { name: 'Home', sales: 12, revenue: 150.50, percentage: 12 }
                    ],
                    recentActivity: [
                        { id: 1, type: 'order', description: 'New order #1003 received', timestamp: '2024-01-15T14:30:00Z' },
                        { id: 2, type: 'sale', description: 'Product "Sample Product 1" sold', timestamp: '2024-01-15T13:15:00Z' },
                        { id: 3, type: 'review', description: 'New 5-star review received', timestamp: '2024-01-15T12:00:00Z' }
                    ],
                    avgOrderValue: 27.78,
                    customerSatisfaction: 4.8,
                    returnRate: 2.1,
                    repeatCustomers: 35
                };
            } catch (error) {
                console.error('Error loading analytics:', error);
            }
        },
        
        getActivityIcon(type) {
            const icons = {
                'order': 'bi bi-cart',
                'sale': 'bi bi-currency-dollar',
                'review': 'bi bi-star',
                'return': 'bi bi-arrow-return-left'
            };
            return icons[type] || 'bi bi-info-circle';
        },
        
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        }
    }
}
</script> 