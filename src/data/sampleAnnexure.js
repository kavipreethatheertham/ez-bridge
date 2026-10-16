/**
 * Sample annexure LN0025 from the sheet.
 * Numbers are strings because they come from <input> fields.
 */
export const createSampleAnnexure = () => ({
  loanNo: 'LN0025',
  principal: '15000000', // ₹1,50,00,000
  loanRate: '10',
  partners: [
    { id: 'p1', person: 'vivekasundaram', amount: '5000000', rate: '2' }, // ₹50,00,000 @ 2%
    { id: 'p2', person: 'tvh-manivannan', amount: '10000000', rate: '5' }, // ₹1,00,00,000 @ 5%
  ],
})
