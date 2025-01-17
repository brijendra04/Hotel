import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { supabase } from '../lib/supabase';
import { Hotel } from '../types/hotel';
import { toast } from 'react-hot-toast';

interface ImageSearchProps {
  onResults: (hotels: Hotel[]) => void;
}

export default function ImageSearch({ onResults }: ImageSearchProps) {
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);

  // Load MobileNet model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true);
        await tf.ready(); // Ensure TensorFlow.js is ready
        const loadedModel = await mobilenet.load({
          version: 2,
          alpha: 1.0
        });
        setModel(loadedModel);
      } catch (error) {
        console.error('Failed to load model:', error);
        toast.error('Failed to initialize image search. Please try again later.');
      } finally {
        setModelLoading(false);
      }
    };
    loadModel();

    // Cleanup
    return () => {
      if (model) {
        model.dispose();
      }
    };
  }, []);

  const extractFeatures = async (imageElement: HTMLImageElement): Promise<number[] | null> => {
    if (!model) return null;
    
    const tensors: tf.Tensor[] = [];
    try {
      // Convert image to tensor
      const tfImage = tf.browser.fromPixels(imageElement);
      tensors.push(tfImage);
      
      // Resize to match MobileNet input size
      const resized = tf.image.resizeBilinear(tfImage, [224, 224]);
      tensors.push(resized);
      
      // Normalize values to [-1, 1]
      const normalized = tf.div(tf.sub(resized, 127.5), 127.5);
      tensors.push(normalized);
      
      // Add batch dimension
      const batched = tf.expandDims(normalized, 0);
      tensors.push(batched);
      
      // Get embedding from the model
      const embedding = await model.infer(batched, {
        embedding: true
      }) as tf.Tensor;
      tensors.push(embedding);
      
      // Convert to array
      const features = await embedding.data();
      return Array.from(features);
    } catch (error) {
      console.error('Error extracting features:', error);
      return null;
    } finally {
      // Cleanup tensors
      tensors.forEach(t => t.dispose());
    }
  };

  const findSimilarHotels = async (features: number[]) => {
    try {
      const { data, error } = await supabase.rpc('match_hotels', {
        query_embedding: features,
        match_threshold: 0.7,
        match_count: 6
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding similar hotels:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setLoading(true);
      
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Load image and wait for it to be ready
      const img = new Image();
      img.src = objectUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      // Extract features from the image
      const features = await extractFeatures(img);
      if (!features) {
        throw new Error('Failed to extract image features');
      }

      // Find similar hotels
      const similarHotels = await findSimilarHotels(features);
      onResults(similarHotels);

      toast.success('Found similar hotels!');
    } catch (error: any) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
      onResults([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  }, [model, onResults]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false,
    disabled: modelLoading || loading
  });

  if (modelLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg p-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">Initializing image search...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        {loading ? (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
            <p className="text-gray-600">Analyzing image...</p>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg"
            />
            <p className="text-sm text-gray-500">
              Drop another image or click to change
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              {isDragActive ? (
                <Upload className="h-12 w-12 text-blue-500" />
              ) : (
                <ImageIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop an image here or click to upload
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Upload a photo to find hotels with similar style and ambiance
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}