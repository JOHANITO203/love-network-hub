import { supabase } from '@/integrations/supabase/client';

export const testStorageSetup = async () => {
  try {
    // Test if we can list buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return false;
    }



    // Check if profile-images bucket exists
    const profileImagesBucket = buckets?.find(bucket => bucket.id === 'profile-images');

    if (!profileImagesBucket) {
      console.error('profile-images bucket not found');
      return false;
    }



    // Test file upload permissions by creating a test file
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload('test/test.txt', testFile);

    if (uploadError) {
      console.error('Upload test failed:', uploadError);
      return false;
    }



    // Clean up test file
    await supabase.storage
      .from('profile-images')
      .remove(['test/test.txt']);

    return true;
  } catch (error) {
    console.error('Storage test error:', error);
    return false;
  }
};