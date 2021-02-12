
Pod::Spec.new do |s|
  s.name         = "RNAudioVideoTools"
  s.version      = "1.0.0"
  s.summary      = "RNAudioVideoTools"
  s.description  = <<-DESC
                  RNAudioVideoTools
                   DESC
  s.homepage     = "https://github.com/PatrissolJuns/react-native-audio-video-tools"
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/author/RNAudioVideoTools.git", :tag => "master" }
  s.source_files  = "RNAudioVideoTools/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  
