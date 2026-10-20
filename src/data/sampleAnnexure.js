/**
 * Sample annexure LN0025 from the sheet.
 * Numbers are strings because they come from <input> fields.
 */
export const createSampleAnnexure = () => ({
  loanNo: 'LN0025',
  borrowerName: '', // typed in by the user; the sample loan has none
  principal: '15000000', // ₹1,50,00,000
  loanRate: '10',
  partners: [
    { id: 'p1', person: 'vivekasundaram', amount: '5000000', rate: '2' }, // ₹50,00,000 @ 2%
    { id: 'p2', person: 'tvh-manivannan', amount: '10000000', rate: '5' }, // ₹1,00,00,000 @ 5%
  ],
  fees: [
    { id: 'f1', person: 'sathise', label: 'Case fees', amount: '0' }, // Sathise is recorded at ₹0
  ],
  consults: [
    { id: 'c1', person: 'mohammad-idris', rate: '1' }, // 1% of the principal, ₹1,50,00,000
  ],
  // Eazee Bridge: a ₹7,50,000 pool split between Vivek and Sathise. It only feeds the
  // "Bridge split" tile for now; the Eazee Bridge section itself is added later.
  bridgeTotal: '750000',
  splits: [
    { id: 'b1', person: 'vivek', amount: '375000' },
    { id: 'b2', person: 'sathise', amount: '375000' },
  ],
})
