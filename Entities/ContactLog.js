export class ContactLog {
  constructor(data = {}) {
    this.id = data.id || Date.now().toString()
    this.property_id = data.property_id || ''
    this.contact_date = data.contact_date || new Date().toISOString()
    this.contact_method = data.contact_method || 'phone'
    this.outcome = data.outcome || 'no_answer'
    this.notes = data.notes || ''
    this.follow_up_date = data.follow_up_date || null
  }

  static async list(propertyId = null) {
    // For now, return mock data. In a real app, this would fetch from an API
    const mockContactLogs = [
      {
        id: '1',
        property_id: '1',
        contact_date: '2024-01-25T10:00:00.000Z',
        contact_method: 'phone',
        outcome: 'voicemail',
        notes: 'Left message asking for callback',
        follow_up_date: '2024-01-27T10:00:00.000Z'
      },
      {
        id: '2',
        property_id: '1',
        contact_date: '2024-01-26T14:00:00.000Z',
        contact_method: 'email',
        outcome: 'interested',
        notes: 'Owner responded via email, interested in selling',
        follow_up_date: '2024-01-28T14:00:00.000Z'
      }
    ]
    
    if (propertyId) {
      return mockContactLogs.filter(log => log.property_id === propertyId)
    }
    
    return mockContactLogs
  }

  static async create(data) {
    const contactLog = new ContactLog(data)
    // In a real app, this would save to an API
    console.log('Contact log created:', contactLog)
    return contactLog
  }

  static async update(id, data) {
    // In a real app, this would update via API
    console.log('Contact log updated:', { id, data })
    return { ...data, id }
  }

  static async delete(id) {
    // In a real app, this would delete via API
    console.log('Contact log deleted:', id)
    return true
  }
} 