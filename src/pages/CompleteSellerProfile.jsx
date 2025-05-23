import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompleteSellerProfile = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    businessType: 'individual',
    taxId: '',
    bankName: '',
    accountNumber: '',
    accountName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('jason_sellers')
        .insert([{
          user_id: user.id,
          business_name: formData.businessName,
          business_description: formData.businessDescription,
          business_type: formData.businessType,
          tax_id: formData.taxId,
          bank_account_details: {
            bank_name: formData.bankName,
            account_number: formData.accountNumber,
            account_name: formData.accountName
          },
          is_profile_complete: true
        }]);

      if (error) throw error;

      toast.success('Profile completed successfully!');
      navigate('/seller/dashboard');
    } catch (error) {
      console.error('Error completing profile:', error);
      setError(error.message || 'Failed to complete profile');
      toast.error(error.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto my-12 bg-white rounded-lg shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">Complete Your Seller Profile</h2>
      
      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            name="businessName"
            required
            value={formData.businessName}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="businessDescription">Business Description</Label>
          <textarea
            id="businessDescription"
            name="businessDescription"
            rows="3"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.businessDescription}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="businessType">Business Type</Label>
          <select
            id="businessType"
            name="businessType"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.businessType}
            onChange={handleChange}
          >
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </select>
        </div>

        <div>
          <Label htmlFor="taxId">Tax ID (Optional)</Label>
          <Input
            id="taxId"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4 border-t">
          <h3 className="mb-4 text-lg font-medium">Bank Account Details</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                name="bankName"
                required
                value={formData.bankName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                required
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                name="accountName"
                required
                value={formData.accountName}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Complete Profile"
          )}
        </Button>
      </form>
    </div>
  );
};

export default CompleteSellerProfile;