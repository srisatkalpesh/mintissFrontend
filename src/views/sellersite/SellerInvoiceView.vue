<template>
  <div class="seller-invoice-view">
    <div class="invoice-container">
      <!-- Modern Invoice Header -->
      <div class="invoice-header">
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

      <!-- Modern Invoice Content -->
      <div v-else-if="invoiceData" class="invoice-content">
        <!-- Invoice Title -->
        <div class="invoice-title">
          <h1>SELLER INVOICE</h1>
          <p class="invoice-subtitle">GST Invoice for Business</p>
        </div>

        <!-- Invoice Details and Customer Info -->
        <div class="invoice-details-section">
          <div class="invoice-info">
            <div class="detail-row">
              <span class="label">Date Issued:</span>
              <span class="value">{{ formatDate(invoiceData.order.created_at) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Invoice No:</span>
              <span class="value">{{ invoiceData.invoice_number }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Order ID:</span>
              <span class="value">#{{ invoiceData.order.id }}</span>
            </div>
          </div>
          <div class="customer-info">
            <div class="customer-name">{{ invoiceData.order.user.name }}</div>
            <div class="customer-address">
              <div>{{ invoiceData.order.address.address_line }}</div>
              <div v-if="invoiceData.order.address.landmark">{{ invoiceData.order.address.landmark }}</div>
              <div>{{ invoiceData.order.address.city }}, {{ invoiceData.order.address.state }} {{ invoiceData.order.address.postal_code }}</div>
              <div>Phone: {{ invoiceData.order.address.mobile }}</div>
            </div>
          </div>
        </div>

        <!-- GST Information -->
        <div class="gst-info-section">
          <h3>GST Information</h3>
          <div class="gst-details-grid">
            <div class="seller-gst-info">
              <h4>Your GST Details</h4>
              <p><strong>GST Number:</strong> {{ invoiceData.seller_gst_number || 'Not Available' }}</p>
              <p><strong>Business Name:</strong> {{ invoiceData.seller_store_name }}</p>
              <p><strong>Address:</strong> {{ invoiceData.seller_address }}</p>
            </div>
            <div class="customer-gst-info">
              <h4>Customer Details</h4>
              <p><strong>Name:</strong> {{ invoiceData.order.user.name }}</p>
              <p><strong>Email:</strong> {{ invoiceData.order.user.email }}</p>
              <p><strong>State:</strong> {{ invoiceData.order.address.state }}</p>
            </div>
          </div>
        </div>

        <!-- Itemized Table -->
        <div class="items-table">
          <table>
            <thead>
              <tr>
                <th>NO</th>
                <th>DESCRIPTION</th>
                <th>HSN/SAC</th>
                <th>QTY</th>
                <th>RATE</th>
                <th>TAXABLE AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>{{ invoiceData.order.product.name }}</td>
                <td>9983</td>
                <td>{{ invoiceData.order.quantity || 1 }}</td>
                <td>₹{{ formatCurrency(invoiceData.order.base_price || invoiceData.order.price || invoiceData.order.product.price) }}</td>
                <td>₹{{ formatCurrency((invoiceData.order.base_price || invoiceData.order.price || invoiceData.order.product.price) * (invoiceData.order.quantity || 1)) }}</td>
              </tr>
              <tr v-if="invoiceData.order.custom_text && invoiceData.order.text_addition">
                <td>2</td>
                <td>Text Customization: "{{ invoiceData.order.custom_text }}"</td>
                <td>9983</td>
                <td>1</td>
                <td>₹{{ formatCurrency(invoiceData.order.text_addition) }}</td>
                <td>₹{{ formatCurrency(invoiceData.order.text_addition) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="subtotal-row">
                <td colspan="5" class="subtotal-label">TAXABLE AMOUNT</td>
                <td class="subtotal-amount">₹{{ formatCurrency(calculateTaxableAmount()) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- GST Breakdown -->
        <div class="gst-breakdown-section" v-if="invoiceData.gst_breakdown">
          <h3>GST Breakdown</h3>
          <table class="gst-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Taxable Amount</th>
                <th>GST Rate</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
                <th>Total GST</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in invoiceData.gst_breakdown.items" :key="index">
                <td>{{ item.description }}</td>
                <td class="text-right">₹{{ formatCurrency(item.taxable_amount) }}</td>
                <td class="text-right">{{ item.gst_rate }}%</td>
                <td class="text-right">₹{{ formatCurrency(item.cgst) }}</td>
                <td class="text-right">₹{{ formatCurrency(item.sgst) }}</td>
                <td class="text-right">₹{{ formatCurrency(item.igst) }}</td>
                <td class="text-right">₹{{ formatCurrency(item.total_gst) }}</td>
              </tr>
              <tr class="gst-total-row">
                <td><strong>Total</strong></td>
                <td class="text-right"><strong>₹{{ formatCurrency(invoiceData.gst_breakdown.totals.cgst + invoiceData.gst_breakdown.totals.sgst + invoiceData.gst_breakdown.totals.igst) }}</strong></td>
                <td class="text-right"><strong>{{ invoiceData.gst_breakdown.totals.cgst_rate + invoiceData.gst_breakdown.totals.sgst_rate + invoiceData.gst_breakdown.totals.igst_rate }}%</strong></td>
                <td class="text-right"><strong>₹{{ formatCurrency(invoiceData.gst_breakdown.totals.cgst) }}</strong></td>
                <td class="text-right"><strong>₹{{ formatCurrency(invoiceData.gst_breakdown.totals.sgst) }}</strong></td>
                <td class="text-right"><strong>₹{{ formatCurrency(invoiceData.gst_breakdown.totals.igst) }}</strong></td>
                <td class="text-right"><strong>₹{{ formatCurrency(invoiceData.gst_breakdown.totals.total_gst) }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Grand Total -->
        <div class="grand-total">
          <div class="total-row">
            <span class="total-label">TOTAL AMOUNT (Including GST)</span>
            <span class="total-amount">₹{{ formatCurrency(calculateGrandTotal()) }}</span>
          </div>
        </div>

        <!-- Business Notes -->
        <div class="business-notes">
          <div class="notes-section">
            <div class="note-title">Business Notes:</div>
            <div class="note-content">
              <p>• This is a GST compliant invoice</p>
              <p>• All taxes are as per applicable GST rates</p>
              <p>• Payment terms: As per order agreement</p>
            </div>
          </div>
          <div class="signature-section">
            <div class="signature">{{ invoiceData.seller_store_name }}</div>
            <div class="signature-title">Authorized Signatory</div>
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
  name: 'SellerInvoiceView',
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
          () => axios.get(`/seller/orders/${this.orderId}/invoice`),
          'Loading seller invoice...'
        );
        
        if (response.data.status) {
          this.invoiceData = response.data.data;
        } else {
          this.error = response.data.message || 'Failed to load invoice';
        }
      } catch (error) {
        console.error('Error loading seller invoice:', error);
        this.error = 'Failed to load invoice. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    async downloadInvoice() {
      try {
        this.downloading = true;
        
        const response = await axios.get(`/seller/orders/${this.orderId}/invoice/download`, {
          responseType: 'blob'
        });
        
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `seller_invoice_${this.invoiceData.invoice_number}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        toastService.success('Seller invoice downloaded successfully');
      } catch (error) {
        console.error('Error downloading seller invoice:', error);
        toastService.error('Failed to download seller invoice');
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
    },

    calculateTaxableAmount() {
      if (!this.invoiceData || !this.invoiceData.order) return 0;
      
      const order = this.invoiceData.order;
      let taxableAmount = 0;
      
      // Add base price (use product price as fallback) multiplied by quantity
      const unitPrice = parseFloat(order.base_price || order.price || order.product.price || 0);
      const quantity = parseInt(order.quantity || 1);
      taxableAmount += unitPrice * quantity;
      
      // Add text addition if exists
      if (order.text_addition) {
        taxableAmount += parseFloat(order.text_addition);
      }
      
      return taxableAmount;
    },

    calculateGrandTotal() {
      if (!this.invoiceData || !this.invoiceData.order) return 0;
      
      const order = this.invoiceData.order;
      let total = this.calculateTaxableAmount();
      
      // Add GST if available
      if (this.invoiceData.gst_breakdown && this.invoiceData.gst_breakdown.totals) {
        total += parseFloat(this.invoiceData.gst_breakdown.totals.total_gst);
      }
      
      return total;
    }
  }
};
</script>

<style scoped>
.seller-invoice-view {
  min-height: 100vh;
  background: white;
  position: relative;
}

.seller-invoice-view::before {
  content: '';
  position: fixed;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  clip-path: polygon(0 0, 100% 0, 100% 100%);
  z-index: 0;
}

.seller-invoice-view::after {
  content: '';
  position: fixed;
  bottom: 0;
  left: 0;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #0d5a9a 0%, #1177bf 100%);
  clip-path: polygon(0 0, 0 100%, 100% 100%);
  z-index: 0;
}

.invoice-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
  background: white;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  margin-bottom: 2rem;
}

/* Header */
.invoice-header {
  background: transparent;
  padding: 1rem 0;
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-end;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-download,
.btn-print {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #1177bf;
  background: white;
  color: #1177bf;
}

.btn-download:hover:not(:disabled) {
  background: #1177bf;
  color: white;
  transform: translateY(-1px);
}

.btn-print:hover {
  background: #1177bf;
  color: white;
  transform: translateY(-1px);
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
  border-top: 5px solid #1177bf;
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
  background: #1177bf;
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem auto 0;
}

.btn-retry:hover {
  background: #0d5a9a;
  transform: translateY(-1px);
}

/* Modern Invoice Content */
.invoice-content {
  background: white;
  padding: 0;
}

.invoice-title {
  margin-bottom: 2rem;
  text-align: center;
}

.invoice-title h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #1177bf;
  margin: 0;
  font-family: 'Arial', sans-serif;
  letter-spacing: 2px;
}

.invoice-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.invoice-details-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #1177bf;
}

.invoice-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}

.detail-row .label {
  font-weight: 500;
  color: #666;
  min-width: 100px;
}

.detail-row .value {
  font-weight: 600;
  color: #333;
}

.customer-info {
  text-align: right;
}

.customer-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.customer-address {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.customer-address div {
  margin-bottom: 0.2rem;
}

/* GST Information Section */
.gst-info-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
  border: 1px solid #1177bf;
}

.gst-info-section h3 {
  color: #1177bf;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.gst-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.seller-gst-info h4,
.customer-gst-info h4 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.seller-gst-info p,
.customer-gst-info p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
  color: #666;
}

/* Items Table */
.items-table {
  margin: 2rem 0;
}

.items-table table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.items-table th {
  background: #1177bf;
  color: white;
  font-weight: 600;
  padding: 1rem 0.5rem;
  text-align: left;
  border: 1px solid #ddd;
  font-size: 0.9rem;
}

.items-table td {
  padding: 1rem 0.5rem;
  border: 1px solid #ddd;
  color: #333;
  font-size: 0.9rem;
}

.items-table tbody tr:nth-child(even) {
  background: #f9f9f9;
}

.subtotal-row {
  background: #f5f5f5 !important;
  border-top: 2px solid #1177bf;
}

.subtotal-label {
  font-weight: 600;
  color: #333;
  text-align: right;
  padding: 1rem 0.5rem;
}

.subtotal-amount {
  font-weight: 600;
  color: #333;
  padding: 1rem 0.5rem;
}

/* GST Breakdown */
.gst-breakdown-section {
  margin: 2rem 0;
}

.gst-breakdown-section h3 {
  color: #1177bf;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.gst-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.gst-table th {
  background: #1177bf;
  color: white;
  font-weight: 600;
  padding: 1rem 0.5rem;
  text-align: left;
  border: 1px solid #ddd;
  font-size: 0.9rem;
}

.gst-table td {
  padding: 1rem 0.5rem;
  border: 1px solid #ddd;
  color: #333;
  font-size: 0.9rem;
}

.gst-table tbody tr:nth-child(even) {
  background: #f9f9f9;
}

.gst-total-row {
  background: #f5f5f5 !important;
  border-top: 2px solid #1177bf;
  font-weight: bold;
}

.text-right {
  text-align: right;
}

/* Grand Total */
.grand-total {
  margin: 2rem 0;
  display: flex;
  justify-content: flex-end;
}

.total-row {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: #1177bf;
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(17, 119, 191, 0.3);
}

.total-label {
  font-weight: 600;
  font-size: 1.1rem;
}

.total-amount {
  font-weight: 700;
  font-size: 1.3rem;
}

/* Business Notes */
.business-notes {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.notes-section {
  flex: 1;
}

.note-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.note-content {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
}

.note-content p {
  margin: 0.3rem 0;
}

.signature-section {
  text-align: right;
}

.signature {
  font-family: 'Brush Script MT', cursive;
  font-size: 1.5rem;
  color: #1177bf;
  margin-bottom: 0.5rem;
  font-weight: 400;
}

.signature-title {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .invoice-container {
    padding: 1rem;
    margin: 1rem;
  }
  
  .invoice-title h1 {
    font-size: 2rem;
  }
  
  .invoice-details-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .customer-info {
    text-align: left;
  }
  
  .gst-details-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .items-table,
  .gst-table {
    overflow-x: auto;
  }
  
  .items-table table,
  .gst-table {
    min-width: 600px;
  }
  
  .business-notes {
    flex-direction: column;
    gap: 2rem;
    align-items: flex-start;
  }
  
  .signature-section {
    text-align: left;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn-download,
  .btn-print {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .invoice-title h1 {
    font-size: 1.5rem;
  }
  
  .items-table th,
  .items-table td,
  .gst-table th,
  .gst-table td {
    padding: 0.5rem 0.25rem;
    font-size: 0.8rem;
  }
  
  .total-row {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

/* Print Styles */
@media print {
  .seller-invoice-view::before,
  .seller-invoice-view::after {
    display: none;
  }
  
  .header-actions {
    display: none;
  }
  
  .seller-invoice-view {
    background: white;
  }
  
  .invoice-container {
    box-shadow: none;
    margin: 0;
    padding: 1rem;
  }
}
</style>
