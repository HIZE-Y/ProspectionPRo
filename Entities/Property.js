export class Property {
  constructor(data = {}) {
    this.id = data.id || Date.now().toString()
    this.address = data.address || ''
    this.city = data.city || ''
    this.state = data.state || ''
    this.zip = data.zip || ''
    this.owner_name = data.owner_name || ''
    this.owner_phone = data.owner_phone || ''
    this.owner_email = data.owner_email || ''
    this.lead_status = data.lead_status || 'new'
    this.posting_date = data.posting_date || new Date().toISOString()
    this.price = data.price || 0
    this.bedrooms = data.bedrooms || 0
    this.bathrooms = data.bathrooms || 0
    this.sqft = data.sqft || 0
    this.notes = data.notes || ''
    this.created_date = data.created_date || new Date().toISOString()
  }

  static async list(sortBy = '-created_date') {
    // For now, return mock data. In a real app, this would fetch from an API
    const mockProperties = [
      {
        id: '1',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '90210',
        owner_name: 'John Doe',
        owner_phone: '(555) 123-4567',
        owner_email: 'john@example.com',
        lead_status: 'ready_to_contact',
        posting_date: '2024-01-15T00:00:00.000Z',
        price: 450000,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1800,
        notes: 'Owner motivated to sell quickly',
        created_date: '2024-01-10T00:00:00.000Z'
      },
      {
        id: '2',
        address: '456 Oak Ave',
        city: 'Somewhere',
        state: 'CA',
        zip: '90211',
        owner_name: 'Jane Smith',
        owner_phone: '(555) 987-6543',
        owner_email: 'jane@example.com',
        lead_status: 'contacted',
        posting_date: '2024-01-20T00:00:00.000Z',
        price: 520000,
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2200,
        notes: 'Interested in selling, needs quick close',
        created_date: '2024-01-18T00:00:00.000Z'
      }
    ]
    
    return mockProperties
  }

  static async create(data) {
    const property = new Property(data)
    // In a real app, this would save to an API
    console.log('Property created:', property)
    return property
  }

  static async update(id, data) {
    // In a real app, this would update via API
    console.log('Property updated:', { id, data })
    return { ...data, id }
  }

  static async delete(id) {
    // In a real app, this would delete via API
    console.log('Property deleted:', id)
    return true
  }
} 