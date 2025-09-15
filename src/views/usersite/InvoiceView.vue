<template>
  <div class="invoice-view">
    <div class="invoice-container">
      <!-- Header -->
      <div class="invoice-header">
        <div class="header-content">
          <div class="title-section">
            <h1 class="page-title">
              <i class="bi bi-receipt me-3"></i>
              Invoice
            </h1>
            <p class="page-subtitle">Order #{{ orderId }} - {{ invoiceData?.invoice_number }}</p>
          </div>
          <div class="header-actions">
            <button @click="downloadInvoice" class="btn-download" :disabled="downloading">
              <i class="bi bi-download me-2"></i>
              {{ downloading ? 'Downloading...' : 'Download PDF' }}
            </button>
            <button @click="printInvoice" class="btn-print">
              <i class="bi bi-printer me-2"></i>
              Print
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading invoice...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="bi bi-exclamation-triangle"></i>
        <h3>Unable to load invoice</h3>
        <p>{{ error }}</p>
        <button @click="loadInvoice" class="btn-retry">
          <i class="bi bi-arrow-clockwise me-2"></i>
          Try Again
        </button>
      </div>

      <!-- Invoice Content -->
      <div v-else-if="invoiceData" class="invoice-content">
        <!-- Invoice Header -->
        <div class="invoice-info-section">
          <div class="invoice-details">
            <h3>Invoice Details</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Invoice Number:</span>
                <span class="value">{{ invoiceData.invoice_number }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Invoice Date:</span>
                <span class="value">{{ formatDate(invoiceData.order.created_at) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Order ID:</span>
                <span class="value">#{{ invoiceData.order.id }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Status:</span>
                <span :class="['status-badge', 'status-' + invoiceData.order.status.toLowerCase()]">
                  {{ invoiceData.order.status }}
                </span>
              </div>
            </div>
          </div>
          <div class="company-info">
            <h3>From</h3>
            <div class="company-details">
              <h4>Mintiss</h4>
              <p>123 Business Street</p>
              <p>City, State 12345</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Email: info@mintiss.com</p>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="customer-section">
          <h3>Customer Information</h3>
          <div class="customer-grid">
            <div class="billing-info">
              <h4>Billing Address</h4>
              <div class="address-details">
                <p><strong>{{ invoiceData.order.address_full_name }}</strong></p>
                <p>{{ invoiceData.order.address_line1 }}</p>
                <p v-if="invoiceData.order.address_line2">{{ invoiceData.order.address_line2 }}</p>
                <p>{{ invoiceData.order.address_city }}, {{ invoiceData.order.address_postal_code }}</p>
              </div>
            </div>
            <div class="shipping-info">
              <h4>Shipping Address</h4>
              <div class="address-details">
                <p><strong>{{ invoiceData.order.address_full_name }}</strong></p>
                <p>{{ invoiceData.order.address_line1 }}</p>
                <p v-if="invoiceData.order.address_line2">{{ invoiceData.order.address_line2 }}</p>
                <p>{{ invoiceData.order.address_city }}, {{ invoiceData.order.address_postal_code }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Details -->
        <div class="order-section">
          <h3>Order Details</h3>
          <div class="product-card">
            <div class="product-info">
              <div class="product-image">
                <img :src="invoiceData.order.product.images[0]" :alt="invoiceData.order.product.name">
              </div>
              <div class="product-details">
                <h4>{{ invoiceData.order.product.name }}</h4>
                <p>{{ invoiceData.order.product.description }}</p>
                <div class="product-pricing">
                  <div class="price-row">
                    <span>Base Price:</span>
                    <span>₹{{ formatCurrency(invoiceData.order.base_price || invoiceData.order.price) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Text Customization -->
          <div v-if="invoiceData.order.custom_text" class="text-customization-card">
            <h4>
              <i class="bi bi-type me-2"></i>
              Text Customization
            </h4>
            <div class="customization-details">
              <div class="custom-text">
                <strong>Custom Text:</strong> "{{ invoiceData.order.custom_text }}"
              </div>
              <div v-if="invoiceData.order.text_percentage && invoiceData.order.text_addition" class="text-pricing">
                <div class="pricing-row">
                  <span>Text Percentage:</span>
                  <span>{{ invoiceData.order.text_percentage }}%</span>
                </div>
                <div class="pricing-row">
                  <span>Text Addition:</span>
                  <span>₹{{ formatCurrency(invoiceData.order.text_addition) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing Summary -->
        <div class="pricing-section">
          <h3>Pricing Summary</h3>
          <div class="pricing-card">
            <div class="pricing-row">
              <span>Subtotal:</span>
              <span>₹{{ formatCurrency(invoiceData.order.subtotal || invoiceData.order.price) }}</span>
            </div>
            <div v-if="invoiceData.order.redeem_amount > 0" class="pricing-row discount">
              <span>Points Redeemed:</span>
              <span>-₹{{ formatCurrency(invoiceData.order.redeem_amount) }}</span>
            </div>
            <div class="pricing-row total">
              <span>Total Amount:</span>
              <span>₹{{ formatCurrency(invoiceData.order.total_amount) }}</span>
            </div>
            <div class="pricing-row">
              <span>Payment Method:</span>
              <span>{{ invoiceData.order.payment_method }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="invoice-footer">
          <div class="footer-content">
            <h4>Thank you for choosing Mintiss!</h4>
            <p>If you have any questions about this invoice, please contact us at info@mintiss.com</p>
            <p>This invoice was generated on {{ formatDate(new Date()) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import loaderService from '@/services/loaderService';
import toastService from '@/services/toastService';

export default {
  name: 'InvoiceView',
  data() {
    return {
      orderId: null,
      invoiceData: null,
      loading: true,
      error: null,
      downloading: false
    };
  },
  async mounted() {
    this.orderId = this.$route.params.orderId;
    await this.loadInvoice();
  },
  methods: {
    async loadInvoice() {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await loaderService.withLoader(
          () => axios.get(`/user/orders/${this.orderId}/invoice`),
          'Loading invoice...'
        );
        
        if (response.data.status) {
          this.invoiceData = response.data.data;
        } else {
          this.error = response.data.message || 'Failed to load invoice';
        }
      } catch (error) {
        console.error('Error loading invoice:', error);
        this.error = 'Failed to load invoice. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    async downloadInvoice() {
      try {
        this.downloading = true;
        
        const response = await axios.get(`/user/orders/${this.orderId}/invoice/download`, {
          responseType: 'blob'
        });
        
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${this.invoiceData.invoice_number}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        toastService.success('Invoice downloaded successfully');
      } catch (error) {
        console.error('Error downloading invoice:', error);
        toastService.error('Failed to download invoice');
      } finally {
        this.downloading = false;
      }
    },

    printInvoice() {
      window.print();
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.invoice-view {
  min-height: 100vh;
  background: #f8fafc;
}

.invoice-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0;
}

/* Header */
.invoice-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-download,
.btn-print {
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-download {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-download:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-print {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-print:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-download:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Loading and Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin: 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state i {
  font-size: 4rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #333;
  margin-bottom: 1rem;
}

.btn-retry {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem auto 0;
}

.btn-retry:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

/* Invoice Content */
.invoice-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin: 0 2rem 2rem;
}

.invoice-info-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.invoice-details h3,
.company-info h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item .label {
  font-weight: 500;
  color: #666;
}

.detail-item .value {
  font-weight: 600;
  color: #333;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-processing { background: #d1ecf1; color: #0c5460; }
.status-shipped { background: #e2e3f1; color: #383d41; }
.status-delivered { background: #d4edda; color: #155724; }
.status-cancelled { background: #f8d7da; color: #721c24; }

.company-details h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.company-details p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

/* Customer Section */
.customer-section {
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.customer-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.customer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.billing-info h4,
.shipping-info h4 {
  margin: 0 0 1rem 0;
  color: #555;
  font-size: 1rem;
  font-weight: 600;
}

.address-details p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

/* Order Section */
.order-section {
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.order-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.product-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.product-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.product-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
}

.product-details h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.product-details p {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.9rem;
}

.product-pricing {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.price-row span:first-child {
  color: #666;
}

.price-row span:last-child {
  font-weight: 600;
  color: #333;
}

/* Text Customization */
.text-customization-card {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.text-customization-card h4 {
  margin: 0 0 1rem 0;
  color: #856404;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.customization-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.custom-text {
  color: #856404;
  font-size: 0.9rem;
}

.text-pricing {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.pricing-row span:first-child {
  color: #856404;
}

.pricing-row span:last-child {
  font-weight: 600;
  color: #856404;
}

/* Pricing Section */
.pricing-section {
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.pricing-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.pricing-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.75rem 0;
  font-size: 1rem;
}

.pricing-row.discount {
  color: #28a745;
}

.pricing-row.total {
  border-top: 2px solid #e9ecef;
  padding-top: 1rem;
  margin-top: 1rem;
  font-weight: 700;
  font-size: 1.2rem;
  color: #333;
}

/* Footer */
.invoice-footer {
  background: #f8f9fa;
  padding: 2rem;
  text-align: center;
}

.footer-content h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.footer-content p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .invoice-content {
    margin: 0 1rem 2rem;
  }
  
  .invoice-info-section {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .customer-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .product-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .product-image {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .btn-download,
  .btn-print {
    width: 100%;
    justify-content: center;
  }
  
  .invoice-info-section,
  .customer-section,
  .order-section,
  .pricing-section,
  .invoice-footer {
    padding: 1rem;
  }
}

/* Print Styles */
@media print {
  .invoice-header {
    background: #667eea !important;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
  
  .header-actions {
    display: none;
  }
  
  .invoice-view {
    background: white;
  }
  
  .invoice-content {
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>
